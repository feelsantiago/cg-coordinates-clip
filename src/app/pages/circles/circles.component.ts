import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PolyFormValue } from '../../components/circle-poly-result/circle-poly-result.component';
import { CircleCoordinate, PolynomialMetadata, TrigonometricMetadata } from '../../types/circle';
import { PmMetadata } from '../../types/lines';
import { Point } from '../../types/coordinates';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { CircleService } from '../../services/circle.service';
import { ViewService } from '../../services/view.service';
import { CoordinatesService } from '../../services/coordinates.service';

enum CircleAlgorithm {
    pm = 'pm',
    polynomial = 'polynomial',
    trigonometric = 'trigonometric',
}

@Component({
    selector: 'app-circles',
    templateUrl: './circles.component.html',
    styleUrls: ['./circles.component.scss'],
})
export class CirclesComponent {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public canvasWidth = 500;

    public canvasHeight = 500;

    public centerPoint: Point;

    public algorithm: CircleAlgorithm = CircleAlgorithm.polynomial;

    public polyMetadata: PolynomialMetadata;

    public trigMetadata: TrigonometricMetadata;

    public pmMetadata: PmMetadata;

    private isNewDraw = true;

    constructor(
        private readonly circleService: CircleService,
        private readonly coordinateService: CoordinatesService,
        private readonly viewService: ViewService,
    ) {}

    public onMouseStartDrawingHandle(endPoint: Point): void {
        this.onCleanCanvasHandle();
        if (this.isNewDraw) {
            this.isNewDraw = false;
            this.centerPoint = endPoint;
        }

        if (this.isDiffPoint(this.centerPoint, endPoint)) {
            const radius = this.circleService.calculateRadius(this.centerPoint, endPoint);

            this.drawCircle(radius).subscribe((result) => {
                const { points, metadata } = result;
                this.extractMetadata(metadata);

                points.forEach((point) => {
                    const { x, y } = point;
                    this.canvas.drawPixel({ x: x + this.centerPoint.x, y: y + this.centerPoint.y });
                });

                this.viewService.sendMetadata({
                    points,
                    metadata,
                    radius,
                });
            });
        }
    }

    public onMouseFinishDrawingHandle(): void {
        this.isNewDraw = true;
    }

    public onCleanCanvasHandle(): void {
        this.canvas.clean();
        this.viewService.clean();
    }

    public onDrawCircleHandle(data: PolyFormValue): void {
        this.canvas.clean();
        this.drawCircleFixValues(data);
    }

    private drawCircleFixValues(data: PolyFormValue): void {
        const viewPort = {
            x: { min: 0, max: this.canvasWidth },
            y: { min: 0, max: this.canvasHeight },
        };

        const pointCenter = this.coordinateService.deviceToWorld({ x: data.x, y: data.y }, viewPort);

        this.centerPoint = { x: pointCenter.x, y: pointCenter.y };

        this.drawCircle(data.radius).subscribe((result) => {
            const { points, metadata } = result;
            this.extractMetadata(metadata);

            points.forEach((point) => {
                const { x, y } = point;
                this.canvas.drawPixel({ x: x + this.centerPoint.x, y: y + this.centerPoint.y });
            });

            this.viewService.sendMetadata({
                points,
                metadata,
                radius: data.radius,
            });
        });
    }

    private drawCircle(
        radius: number,
    ): Observable<CircleCoordinate<PolynomialMetadata | TrigonometricMetadata | PmMetadata>> {
        switch (this.algorithm) {
            case CircleAlgorithm.polynomial:
                return this.circleService.polynomial(radius);
            case CircleAlgorithm.trigonometric:
                return this.circleService.trigonometric(radius);
            case CircleAlgorithm.pm:
                return this.circleService.pm(radius);
            default:
                return this.circleService.polynomial(radius);
        }
    }

    private isDiffPoint(pointA: Point, pointB: Point): boolean {
        return pointA.x !== pointB.x && pointA.y !== pointB.y;
    }

    private extractMetadata(metadata: unknown): void {
        if (this.algorithm === CircleAlgorithm.polynomial) {
            this.polyMetadata = metadata as PolynomialMetadata;
        } else if (this.algorithm === CircleAlgorithm.trigonometric) {
            this.trigMetadata = metadata as TrigonometricMetadata;
        } else {
            this.pmMetadata = metadata as PmMetadata;
        }
    }
}

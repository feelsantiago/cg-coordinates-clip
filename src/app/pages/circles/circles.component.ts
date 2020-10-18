import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CircleCoordinate, PolynomialMetadata, TrigonometricMetadata } from '../../types/circle';
import { PmMetadata } from '../../types/lines';
import { NormalizedRange, Point } from '../../types/coordinates';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { CircleService } from '../../services/circle.service';
import { ViewService } from '../../services/view.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { CircleFormValue } from '../../components/circle-inputs/circle-inputs.component';

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

    private viewPort = {
        x: { min: 0, max: this.canvasWidth },
        y: { min: 0, max: this.canvasHeight },
    };

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

                const { x, y } = this.transformPoint(this.centerPoint);
                this.viewService.sendMetadata({
                    points,
                    metadata,
                    radius,
                    centerPoint: { x, y: y * -1 },
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

    public onDrawCircleHandle(data: CircleFormValue): void {
        this.canvas.clean();
        this.drawCircleFixValues(data);
    }

    private drawCircleFixValues(data: CircleFormValue): void {
        this.centerPoint = { x: data.x, y: data.y };
        const world = this.coordinateService.deviceToWorld({ x: data.x, y: data.y }, this.viewPort);

        this.drawCircle(data.radius).subscribe((result) => {
            const { points, metadata } = result;
            this.extractMetadata(metadata);

            points.forEach((point) => {
                const { x, y } = point;
                this.canvas.drawPixel({ x: x + world.x, y: y + world.y });
            });

            this.viewService.sendMetadata({
                points,
                metadata,
                radius: data.radius,
                centerPoint: this.centerPoint,
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

    private transformPoint(point: Point): Point {
        let result: Point;

        if (point) {
            result = this.coordinateService.transformWorldToDevice(
                this.viewPort,
                this.viewPort,
                point,
                NormalizedRange.center,
            );
        }

        return result;
    }
}

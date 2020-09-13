import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CircleCoordinate, PolynomialMetadata, TrigonometricMetadata } from '../../types/circle';
import { PmMetadata } from '../../types/lines';
import { Point } from '../../types/coordinates';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { CircleService } from '../../services/circle.service';
import { ViewService } from '../../services/view.service';

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

    private isNewDraw = true;

    constructor(private readonly circleService: CircleService, private readonly viewService: ViewService) {}

    public onMouseStartDrawingHandle(endPoint: Point): void {
        this.onCleanCanvasHandle();
        if (this.isNewDraw) {
            this.isNewDraw = false;
            this.centerPoint = endPoint;
        }

        if (this.isDiffPoint(this.centerPoint, endPoint)) {
            const radius = this.circleService.calculateRadius(this.centerPoint, endPoint);

            this.drawCircle(radius).subscribe((result) => {
                const { points } = result;

                points.forEach((point) => {
                    const { x, y } = point;
                    this.canvas.drawPixel({ x: x + this.centerPoint.x, y: y + this.centerPoint.y });
                });

                this.viewService.sendMetadata(result);
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
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewService } from '../../services/view.service';
import { DdaFormValue } from '../../components/line-dda-result/line-dda-result.component';
import { Point } from '../../types/coordinates';
import { CoordinatesService } from '../../services/coordinates.service';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LineService } from '../../services/line.service';
import { DdaMetadata, LineCoordinate, PmMetadata } from '../../types/lines';

enum LineAlgorithm {
    DDA = 'dda',
    PM = 'pm',
}

@Component({
    selector: 'app-lines',
    templateUrl: './lines.component.html',
    styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public canvasWidth = 500;

    public canvasHeight = 500;

    public algorithm: LineAlgorithm = LineAlgorithm.DDA;

    public ddaMetadata: DdaMetadata;

    public pmMetadata: PmMetadata;

    public point: Point;

    public startPoint: Point;

    private isNewDraw = true;

    constructor(
        private readonly lineService: LineService,
        private readonly coordinateService: CoordinatesService,
        private readonly viewService: ViewService,
    ) {}

    public ngOnInit(): void {}

    public onMouseStartDrawingHandle(point: Point): void {
        this.onCleanCanvasHandle();

        if (this.isNewDraw) {
            this.isNewDraw = false;
            this.startPoint = point;
        }

        if (this.isDiffPoint(this.startPoint, point)) {
            this.drawLine(this.startPoint, point).subscribe((coordinates) => {
                this.extractMetadata(coordinates.metadata);
                this.point = coordinates.point;

                this.viewService.sendMetadata({
                    point: this.point,
                    metadata: coordinates.metadata,
                    start: this.startPoint,
                });
                this.canvas.drawPixel(coordinates.point);
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

    public onDrawLineHandle(points: DdaFormValue): void {
        this.canvas.clean();
        this.drawLineFixValues(points);
    }

    private drawLineFixValues(points: DdaFormValue): void {
        const viewPort = {
            x: { min: 0, max: this.canvasWidth },
            y: { min: 0, max: this.canvasHeight },
        };

        const start = this.coordinateService.deviceToWorld({ x: points.startPointX, y: points.startPointY }, viewPort);
        const end = this.coordinateService.deviceToWorld({ x: points.endPointX, y: points.endPointY }, viewPort);

        this.drawLine(start, end).subscribe((coordinates) => {
            this.extractMetadata(coordinates.metadata);
            this.point = coordinates.point;

            // On PM Algorithm we want to show every point on screen
            const point = this.algorithm === LineAlgorithm.PM ? this.point : end;

            this.viewService.sendMetadata({ point, metadata: coordinates.metadata, start });
            this.canvas.drawPixel(coordinates.point);
        });
    }

    private drawLine(start: Point, end: Point): Observable<LineCoordinate<unknown>> {
        if (this.algorithm === LineAlgorithm.DDA) {
            return this.lineService.dda(start, end);
        }

        return this.lineService.pm(start, end);
    }

    private extractMetadata(metadata: unknown): void {
        if (this.algorithm === LineAlgorithm.DDA) {
            this.ddaMetadata = metadata as DdaMetadata;
        } else {
            this.pmMetadata = metadata as PmMetadata;
        }
    }

    private isDiffPoint(pointA: Point, pointB: Point): boolean {
        return pointA.x !== pointB.x && pointA.y !== pointB.y;
    }
}

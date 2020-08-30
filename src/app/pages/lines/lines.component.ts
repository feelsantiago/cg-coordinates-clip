import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
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
export class LinesComponent implements OnInit, AfterViewInit {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public algorithm: LineAlgorithm = LineAlgorithm.PM;

    public ddaMetadata: DdaMetadata;

    public pmMetadata: PmMetadata;

    public point: Point;

    private lastPointDraw: Point;

    constructor(private readonly lineService: LineService, private readonly coordinateService: CoordinatesService) {}

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {}

    public onMouseStartDrawingHandle(point: Point): void {
        this.onCleanCanvasHandle();

        if (!this.lastPointDraw) {
            this.lastPointDraw = point;
        }

        if (this.isDiffPoint(this.lastPointDraw, point)) {
            this.drawLine(this.lastPointDraw, point).subscribe((coordinates) => {
                this.extractMetadata(coordinates.metadata);
                this.point = coordinates.point;

                this.canvas.drawPixel(coordinates.point);
            });
        }
    }

    public onMouseFinishDrawingHandle(): void {
        this.lastPointDraw = undefined;
    }

    public onCleanCanvasHandle(): void {
        this.canvas.clean();
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

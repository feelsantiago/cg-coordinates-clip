import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Point } from '../../types/coordinates';
import { CoordinatesService } from '../../services/coordinates.service';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LineService } from '../../services/line.service';
import { DdaMetadata, LineCoordinate } from '../../types/lines';

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
                this.ddaMetadata = coordinates.metadata as DdaMetadata;
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

    private isDiffPoint(pointA: Point, pointB: Point): boolean {
        return pointA.x !== pointB.x && pointA.y !== pointB.y;
    }
}

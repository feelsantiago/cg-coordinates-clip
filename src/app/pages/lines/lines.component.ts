import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Point } from '../../types/coordinates';
import { CoordinatesService } from '../../services/coordinates.service';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LineService } from '../../services/line.service';
import { DdaMetadata } from '../../types/lines';

@Component({
    selector: 'app-lines',
    templateUrl: './lines.component.html',
    styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit, AfterViewInit {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public ddaMetadata: DdaMetadata;

    private lastPointDraw: Point;

    constructor(private readonly lineService: LineService, private readonly coordinateService: CoordinatesService) {}

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        // this.lineService.dda({ x: 0, y: 0 }, { x: 250, y: -250 }).subscribe((point) => {
        //     this.canvas.drawPixel(point);
        // });
    }

    public onMouseStartDrawingHandle(point: Point): void {
        this.onCleanCanvasHandle();

        if (!this.lastPointDraw) {
            this.lastPointDraw = point;
        }

        if (this.isDiffPoint(this.lastPointDraw, point)) {
            this.lineService.dda(this.lastPointDraw, point).subscribe((coordinates) => {
                this.ddaMetadata = coordinates.metadata;
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

    private isDiffPoint(pointA: Point, pointB: Point): boolean {
        return pointA.x !== pointB.x && pointA.y !== pointB.y;
    }
}

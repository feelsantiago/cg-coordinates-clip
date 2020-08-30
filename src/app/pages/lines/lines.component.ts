import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CoordinatesService } from '../../services/coordinates.service';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LineService } from '../../services/line.service';

@Component({
    selector: 'app-lines',
    templateUrl: './lines.component.html',
    styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit, AfterViewInit {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    constructor(private readonly lineService: LineService, private readonly coordinateService: CoordinatesService) {}

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.lineService.dda({ x: 0, y: 0 }, { x: 250, y: -250 }).subscribe((point) => {
            this.canvas.drawPixel(point);
        });
    }

    public onCleanCanvasHandle(): void {
        this.canvas.clean();
    }
}

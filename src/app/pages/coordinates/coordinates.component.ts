import { Component } from '@angular/core';
import { MouseCoordinatesEvent } from '../../types/events';
import { DocumentService } from '../../services/document.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewPort, NormalizedRange, Point } from '../../types/coordinates';

@Component({
    selector: 'app-coordinates',
    templateUrl: './coordinates.component.html',
    styleUrls: ['./coordinates.component.scss'],
})
export class CoordinatesComponent {
    private isMouseOnCanvas = false;

    private documentViewPort: ViewPort;

    public canvasViewPort: ViewPort = {
        x: {
            min: 0,
            max: 500,
        },
        y: {
            min: 0,
            max: 500,
        },
    };

    public point: Point;

    constructor(
        private readonly documentService: DocumentService,
        private readonly coordinatesService: CoordinatesService,
    ) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.documentViewPort = {
            x: {
                min: 0,
                max: width,
            },
            y: {
                min: 0,
                max: height,
            },
        };
    }

    public onMouseEnterCanvasHandle(isMouseOnCanvas: boolean): void {
        this.isMouseOnCanvas = isMouseOnCanvas;
    }

    public onMouseLeavesCanvasHandle(isMouseOnCanvas: boolean): void {
        this.isMouseOnCanvas = isMouseOnCanvas;
    }

    public onMouseMoveOnCanvasHandle(coordinates: MouseCoordinatesEvent): void {
        if (this.isMouseOnCanvas) {
            const ndc = this.coordinatesService.worldToNdc(coordinates, this.documentViewPort, NormalizedRange.center);
            const device = this.coordinatesService.ndcToDevice(ndc, this.canvasViewPort);
            this.point = device;
        }
    }
}

import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MouseCoordinatesEvent } from '../../types/events';
import { DocumentService } from '../../services/document.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewPort, NormalizedRange, Point } from '../../types/coordinates';

@Component({
    selector: 'app-coordinates',
    templateUrl: './coordinates.component.html',
    styleUrls: ['./coordinates.component.scss'],
})
export class CoordinatesComponent implements AfterViewInit {
    @ViewChild('canvasViewPort', { static: true })
    private canvasViewPortRef: ElementRef;

    private canvasViewPort: HTMLDivElement;

    private isMouseOnCanvas = false;

    private documentViewPort: ViewPort;

    public canvas: ViewPort = {
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
    ) {}

    public ngAfterViewInit(): void {
        this.canvasViewPort = this.canvasViewPortRef.nativeElement as HTMLDivElement;

        this.canvasViewPort.addEventListener('mousemove', (mouse) => {
            const viewPort = this.canvasViewPort.getBoundingClientRect();
            const x = mouse.x - viewPort.left;
            const y = mouse.y - viewPort.top;

            const coordinates = { x, y };

            const ndc = this.coordinatesService.worldToNdc(coordinates, this.documentViewPort, NormalizedRange.center);
            const device = this.coordinatesService.ndcToDevice(ndc, this.canvas);
            this.point = device;
        });

        const width = this.canvasViewPort.clientWidth;
        const height = this.canvasViewPort.clientHeight;

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
            const device = this.coordinatesService.ndcToDevice(ndc, this.canvas);
            this.point = device;
        }
    }
}

import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ViewPort, NormalizedRange } from '../../types/coordinates';
import { DocumentService } from '../../services/document.service';
import { CoordinatesService } from '../../services/coordinates.service';

@Component({
    selector: 'app-canvas-view-port',
    templateUrl: './canvas-view-port.component.html',
    styleUrls: ['./canvas-view-port.component.scss'],
})
export class CanvasViewPortComponent implements AfterViewInit {
    @ViewChild('canvasViewPort', { static: true })
    private canvasViewPortRef: ElementRef;

    private canvasViewPort: HTMLDivElement;

    private isMouseOnCanvas = false;

    private viewPort: ViewPort;

    private viewPortOffSetLeft = 0;

    private viewPortOffSetTop = 0;

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

    constructor(
        private readonly documentService: DocumentService,
        private readonly coordinatesService: CoordinatesService,
    ) {}

    public ngAfterViewInit(): void {
        this.canvasViewPort = this.canvasViewPortRef.nativeElement as HTMLDivElement;
        const viewPort = this.canvasViewPort.getBoundingClientRect();
        this.viewPortOffSetLeft = viewPort.left;
        this.viewPortOffSetTop = viewPort.top;

        this.canvasViewPort.addEventListener('mousemove', (mouse) => {
            const x = mouse.x - this.viewPortOffSetLeft;
            const y = mouse.y - this.viewPortOffSetTop;

            this.coordinatesService.transformAndEmit(this.viewPort, this.canvas, { x, y }, NormalizedRange.center);
        });

        const width = this.canvasViewPort.clientWidth;
        const height = this.canvasViewPort.clientHeight;

        this.viewPort = {
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
}

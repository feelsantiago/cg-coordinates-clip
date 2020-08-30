import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { Point } from '../../types/coordinates';
import { MouseCoordinatesEvent } from '../../types/events';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit {
    @Input()
    public width = 100;

    @Input()
    public height = 100;

    @ViewChild('canvas')
    public canvasRef: ElementRef;

    @Output()
    public onMouseEnterCanvas: EventEmitter<boolean>;

    @Output()
    public onMouseLeavesCanvas: EventEmitter<boolean>;

    @Output()
    public onMouseMoveOnCanvas: EventEmitter<MouseCoordinatesEvent>;

    @Output()
    public onMouseStartDrawing: EventEmitter<MouseCoordinatesEvent>;

    private canvas: HTMLCanvasElement;

    private isMouseOnCanvas = false;

    private isMouseClicked = false;

    private canvasContext: CanvasRenderingContext2D;

    constructor() {
        this.onMouseEnterCanvas = new EventEmitter();
        this.onMouseLeavesCanvas = new EventEmitter();
        this.onMouseMoveOnCanvas = new EventEmitter();
        this.onMouseStartDrawing = new EventEmitter();
    }

    public ngOnInit(): void {}

    public drawPixel(point: Point): void {
        const { x, y } = point;
        this.canvasContext.fillStyle = 'black';
        // this.canvasContext.fillRect(x + 250, 250 - y, 3, 3);
        this.canvasContext.fillRect(x, y, 3, 3);
    }

    public clean(): void {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
        this.drawCartesianLines();
    }

    public ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');

        this.drawCartesianLines();
        this.initCanvasListeners();
    }

    private drawCartesianLines(): void {
        this.canvasContext.strokeStyle = '#ff0000';
        // Y-Axis
        this.canvasContext.moveTo(this.width / 2, 0);
        this.canvasContext.lineTo(this.width / 2, this.height);
        this.canvasContext.stroke();

        // X-Axis-Half
        this.canvasContext.moveTo(0, this.height / 2);
        this.canvasContext.lineTo(this.width, this.height / 2);
        this.canvasContext.stroke();
    }

    private initCanvasListeners(): void {
        this.canvas.addEventListener('mouseenter', () => {
            this.isMouseOnCanvas = true;
            this.onMouseEnterCanvas.emit(this.isMouseOnCanvas);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseOnCanvas = false;
            this.onMouseLeavesCanvas.emit(this.isMouseOnCanvas);
        });

        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            const { x, y } = event;
            this.onMouseMoveOnCanvas.emit({ x, y });

            if (this.isMouseClicked && this.isMouseOnCanvas) {
                this.onMouseStartDrawing.emit({ x, y });
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isMouseClicked = false;
        });

        this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            this.isMouseClicked = true;
            const { x, y } = event;
            this.onMouseStartDrawing.emit({ x, y });
        });
    }
}

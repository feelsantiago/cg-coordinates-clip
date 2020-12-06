import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { DocumentService } from '../../services/document.service';
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

    @Input()
    public cartesianLines = true;

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

    @Output()
    public onMouseFinishDrawing: EventEmitter<MouseCoordinatesEvent>;

    private canvas: HTMLCanvasElement;

    private isMouseOnCanvas = false;

    private isMouseClicked = false;

    private canvasContext: CanvasRenderingContext2D;

    constructor(private readonly documentService: DocumentService) {
        this.onMouseEnterCanvas = new EventEmitter();
        this.onMouseLeavesCanvas = new EventEmitter();
        this.onMouseMoveOnCanvas = new EventEmitter();
        this.onMouseStartDrawing = new EventEmitter();
        this.onMouseFinishDrawing = new EventEmitter();
    }

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');

        if (this.cartesianLines) {
            this.drawCartesianLines();
        }

        this.initCanvasListeners();
    }

    public drawPixel(point: Point): void {
        const { x, y } = point;
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fillRect(x, y, 3, 3);
    }

    public drawFractalTree(startX: number, startY: number, len: number, angle: number, branchWidth: number): void {
        this.canvasContext.lineWidth = branchWidth;

        this.canvasContext.beginPath();
        this.canvasContext.save();

        this.canvasContext.strokeStyle = 'green';
        this.canvasContext.fillStyle = 'green';

        this.canvasContext.translate(startX, startY);
        this.canvasContext.rotate((angle * Math.PI) / 180);
        this.canvasContext.moveTo(0, 0);
        this.canvasContext.lineTo(0, -len);
        this.canvasContext.stroke();

        this.canvasContext.shadowBlur = 15;
        this.canvasContext.shadowColor = 'rgba(0,0,0,0.8)';

        if (len < 10) {
            this.canvasContext.restore();
            return;
        }

        this.drawFractalTree(0, -len, len * 0.8, angle - 15, branchWidth * 0.8);
        this.drawFractalTree(0, -len, len * 0.8, angle + 15, branchWidth * 0.8);

        this.canvasContext.restore();
    }

    public clean(): void {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
        this.drawCartesianLines();
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
            const point = this.getCanvasMouseCoordinates({ x, y });

            this.onMouseMoveOnCanvas.emit(point);

            if (this.isMouseClicked && this.isMouseOnCanvas) {
                this.onMouseStartDrawing.emit(point);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isMouseClicked = false;
            this.onMouseFinishDrawing.emit();
        });

        this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            this.isMouseClicked = true;

            const { x, y } = event;
            const point = this.getCanvasMouseCoordinates({ x, y });

            this.onMouseStartDrawing.emit(point);
        });
    }

    private getCanvasMouseCoordinates(point: Point): Point {
        const viewPort = this.canvas.getBoundingClientRect();
        const viewPortOffSetLeft = viewPort.left;
        const viewPortOffSetTop = viewPort.top;

        return this.documentService.transformGlobalMouseCoordinatesToLocal(
            point,
            viewPortOffSetTop,
            viewPortOffSetLeft,
        );
    }
}

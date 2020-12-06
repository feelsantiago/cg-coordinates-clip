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

    public drawHeart(): void {
        this.canvasContext.save();

        this.canvasContext.shadowColor = '#555555';
        this.canvasContext.shadowBlur = 10;
        this.canvasContext.shadowOffsetX = 2;
        this.canvasContext.shadowOffsetY = 2;

        this.canvasContext.beginPath();

        this.canvasContext.fillStyle = 'rgba( 255, 211, 171, 1 )';
        this.canvasContext.lineWidth = 10;
        this.canvasContext.strokeStyle = 'rgba( 20, 50, 20, 1 )';
        this.canvasContext.rect(0, 0, this.width, this.height);
        this.canvasContext.fill();
        this.canvasContext.stroke();

        this.canvasContext.closePath();

        const screenWidth = this.width;
        const screenHeight = this.height;
        const screenTop = 0;
        const screenLeft = 0;

        const screenBackgroundRender = (a: number): void => {
            this.canvasContext.beginPath();

            this.canvasContext.fillStyle = `rgba( 20, 20, 20, ${a} )`;
            this.canvasContext.fillRect(screenLeft, screenTop, screenWidth, screenHeight);

            this.canvasContext.closePath();

            this.canvasContext.beginPath();

            for (let j = 10 + screenTop; j < screenTop + screenHeight; j += 10) {
                this.canvasContext.moveTo(screenLeft, j);
                this.canvasContext.lineTo(screenLeft + screenWidth, j);
            }

            for (let i = 10 + screenLeft; i < screenLeft + screenWidth; i += 10) {
                this.canvasContext.moveTo(i, screenTop);
                this.canvasContext.lineTo(i, screenTop + screenHeight);
            }

            this.canvasContext.lineWidth = 1;
            this.canvasContext.strokeStyle = `rgba( 20, 50, 20, ${a} )`;
            this.canvasContext.stroke();
            this.canvasContext.closePath();
        };

        this.canvasContext.shadowBlur = 0;
        this.canvasContext.shadowOffsetX = 0;
        this.canvasContext.shadowOffsetY = 0;
        screenBackgroundRender(1);

        // animation
        let PosX = screenLeft;
        let PosY = screenTop + screenHeight / 2;

        setInterval(() => {
            this.canvasContext.restore();

            screenBackgroundRender(0.06);

            this.canvasContext.beginPath();
            this.canvasContext.moveTo(PosX, PosY);
            PosX += 1;
            if (PosX >= screenLeft + (screenWidth * 40) / 100 && PosX < screenLeft + (screenWidth * 45) / 100) {
                PosY -= (screenHeight * 3) / 100;
            }
            if (PosX >= screenLeft + (screenWidth * 45) / 100 && PosX < screenLeft + (screenWidth * 55) / 100) {
                PosY += (screenHeight * 3) / 100;
            }
            if (PosX >= screenLeft + (screenWidth * 55) / 100 && PosX < screenLeft + (screenWidth * 60) / 100) {
                PosY -= (screenHeight * 3) / 100;
            }
            if (PosX >= screenLeft + (screenWidth * 60) / 100 && PosX <= screenLeft + screenWidth) {
                PosY = screenTop + screenHeight / 2;
            }
            if (PosX > screenLeft + screenWidth) {
                PosX = screenLeft;
                this.canvasContext.moveTo(PosX, PosY);
            }
            this.canvasContext.lineTo(PosX, PosY);
            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeStyle = '#33ff33';
            this.canvasContext.stroke();
            this.canvasContext.closePath();
        }, 6);
    }

    public drawImage(image: HTMLImageElement): void {
        this.canvasContext.drawImage(image, 0, 0, this.width, this.height);
    }

    public putImageDate(data: ImageData): void {
        this.canvasContext.putImageData(data, 0, 0);
    }

    public getImageData(): ImageData {
        return this.canvasContext.getImageData(0, 0, this.width, this.height);
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

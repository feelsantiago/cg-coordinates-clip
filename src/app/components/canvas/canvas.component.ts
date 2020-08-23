import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
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

    private canvas: HTMLCanvasElement;

    private isMouseOnCanvas = false;

    constructor() {
        this.onMouseEnterCanvas = new EventEmitter();
        this.onMouseLeavesCanvas = new EventEmitter();
        this.onMouseMoveOnCanvas = new EventEmitter();
    }

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;

        this.drawCartesianLines();
        this.initCanvasListeners();
    }

    private drawCartesianLines(): void {
        const ctx = this.canvas.getContext('2d');

        // X-Axis
        ctx.moveTo(0, this.height / 2);
        ctx.lineTo(this.width, this.height / 2);
        ctx.stroke();

        // Y-Axis
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2, this.height);
        ctx.stroke();
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
        });
    }
}

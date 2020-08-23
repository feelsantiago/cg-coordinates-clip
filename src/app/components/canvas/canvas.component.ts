import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

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

    private canvas: HTMLCanvasElement;

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
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
}

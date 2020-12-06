import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CanvasComponent } from '../../components/canvas/canvas.component';

@Component({
    selector: 'app-fractal',
    templateUrl: 'fractal.component.html',
    styleUrls: ['fractal.component.scss'],
})
export class FractalComponent implements AfterViewInit {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public ngAfterViewInit(): void {
        this.canvas.drawFractalTree(400, 600, 120, 0, 10);
    }
}

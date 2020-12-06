import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CanvasComponent } from '../../components/canvas/canvas.component';

@Component({
    selector: 'app-heart',
    templateUrl: 'heart.component.html',
    styleUrls: ['heart.component.scss'],
})
export class HeartComponent implements AfterViewInit {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public ngAfterViewInit(): void {
        this.canvas.drawHeart();
    }
}

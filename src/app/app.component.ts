import { Component, OnInit } from '@angular/core';
import { CoordinatesService } from './services/coordenates.service';
import { Point } from './types/coordinates';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public ndc: Point = { x: 0, y: 0 };

    public dc: Point = { x: 0, y: 0 };

    constructor(private readonly coordinatesService: CoordinatesService) {}

    public ngOnInit(): void {
        const worldPoint = { x: 600, y: 800 };
        const worldViewPort = { x: { min: 0, max: 2500 }, y: { min: 0, max: 4000 } };
        const deviceViewPort = { x: { min: 0, max: 1080 }, y: { min: 0, max: 1920 } };

        this.ndc = this.coordinatesService.worldToNdc(worldPoint, worldViewPort);
        this.dc = this.coordinatesService.ndcToDevice(this.ndc, deviceViewPort);
    }
}

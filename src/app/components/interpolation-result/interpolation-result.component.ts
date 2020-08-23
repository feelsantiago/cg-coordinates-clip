import { Component } from '@angular/core';
import { SubSink } from 'subsink';
import { ViewPort, Point } from '../../types/coordinates';
import { CoordinatesService } from '../../services/coordinates.service';

@Component({
    selector: 'app-interpolation-result',
    templateUrl: './interpolation-result.component.html',
    styleUrls: ['./interpolation-result.component.scss'],
})
export class InterpolationResultComponent {
    private subscriptions = new SubSink();

    public world: ViewPort;

    public device: ViewPort;

    public point: Point;

    public ndc: Point;

    public dc: Point;

    constructor(private readonly coordinatesService: CoordinatesService) {
        this.subscriptions.sink = this.coordinatesService.onTransformation$.subscribe((result) => {
            const { world, device, point, ndc, dc } = result;

            this.world = world;
            this.device = device;
            this.point = point;
            this.ndc = ndc;
            this.dc = dc;
        });
    }
}

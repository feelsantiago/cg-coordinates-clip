import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ViewPort, Point, Range } from '../../types/coordinates';
import { CoordinatesService, TransformEvent } from '../../services/coordinates.service';

@Component({
    selector: 'app-transformation-result',
    styleUrls: ['./transformation-result.component.scss'],
    templateUrl: './transformation-result.component.html',
})
export class TransformationResultComponent implements OnInit {
    private readonly subscriptions = new SubSink();

    public world: ViewPort;

    public device: ViewPort;

    public point: Point;

    public range: Range = [0, 1];

    public ndc: Point;

    public dc: Point;

    public showCalculation = false;

    constructor(private readonly coordinateService: CoordinatesService) {
        this.world = this.getInitialViewPort();
        this.device = this.getInitialViewPort();
        this.point = this.getInitialPoint();
        this.ndc = this.getInitialPoint();
        this.dc = this.getInitialPoint();
    }

    public ngOnInit(): void {
        this.subscriptions.sink = this.coordinateService.onTransformation$.subscribe((value) =>
            this.onTransformationHandle(value),
        );
    }

    private onTransformationHandle(value: TransformEvent): void {
        const { world, device, point, range, ndc, dc } = value;
        this.world = world;
        this.device = device;
        this.point = point;
        this.range = range;
        this.ndc = ndc;
        this.dc = dc;
        this.showCalculation = true;
    }

    private getInitialViewPort(): ViewPort {
        return { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    }

    private getInitialPoint(): Point {
        return { x: 0, y: 0 };
    }
}

import { Component, Input, SimpleChanges } from '@angular/core';
import { CoordinatesService } from '../../services/coordinates.service';
import { Point, ViewPort, NormalizedRange } from '../../types/coordinates';
import { DdaMetadata } from '../../types/lines';

@Component({
    selector: 'app-line-dda-result',
    templateUrl: './line-dda-result.component.html',
    styleUrls: ['./line-dda-result.component.scss'],
})
export class LineDdaResultComponent {
    @Input()
    public metadata: DdaMetadata;

    @Input()
    public point: Point;

    private viewPort: ViewPort = {
        x: {
            min: 0,
            max: 500,
        },
        y: {
            min: 0,
            max: 500,
        },
    };

    constructor(private readonly coordinateService: CoordinatesService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        this.transformPoint(changes.point.currentValue);
    }

    private transformPoint(point: Point): void {
        if (point) {
            this.point = this.coordinateService.transformWorldToDevice(
                this.viewPort,
                this.viewPort,
                point,
                NormalizedRange.center,
            );
        }
    }
}

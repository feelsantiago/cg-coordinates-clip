import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ViewService } from '../../services/view.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { Point, ViewPort, NormalizedRange } from '../../types/coordinates';
import { PmMetadata, LineCoordinate } from '../../types/lines';

@Component({
    selector: 'app-line-pm-result',
    templateUrl: './line-pm-result.component.html',
    styleUrls: ['./line-pm-result.component.scss'],
})
export class LinePmResultComponent implements OnInit {
    public metadata: PmMetadata;

    public point: Point;

    private subscriptions: SubSink;

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

    constructor(private readonly coordinateService: CoordinatesService, private readonly viewService: ViewService) {
        this.subscriptions = new SubSink();
    }

    public ngOnInit(): void {
        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { point, metadata, start } = coordinates as LineCoordinate<PmMetadata> & { start: Point };
            this.transformPoint(point);
        });
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

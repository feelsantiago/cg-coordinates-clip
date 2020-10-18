import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewService } from '../../services/view.service';
import { PmMetadata } from '../../types/lines';
import { CircleCoordinate } from '../../types/circle';
import { Point } from '../../types/coordinates';
import { CircleFormValue } from '../circle-inputs/circle-inputs.component';

interface CirclePoint {
    point: Point;
    d: number;
}

@Component({
    selector: 'app-circle-pm-result',
    templateUrl: './circle-pm-result.component.html',
    styleUrls: ['./circle-pm-result.component.scss'],
})
export class CirclePmResultComponent implements OnInit {
    @Output()
    public onDrawCircle: EventEmitter<CircleFormValue>;

    public centerPoint: Point = { x: 0, y: 0 };

    public radius = 0;

    public metadata: PmMetadata;

    public circlePoints: CirclePoint[];

    private subscriptions: SubSink;

    constructor(private readonly coordinateService: CoordinatesService, private readonly viewService: ViewService) {
        this.onDrawCircle = new EventEmitter();
        this.subscriptions = new SubSink();
        this.circlePoints = [{ d: 0, point: { x: 0, y: 0 } }];
    }

    public ngOnInit(): void {
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.metadata = this.getInitialMetadata();
            this.circlePoints = [{ d: 0, point: { x: 0, y: 0 } }];
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { metadata, centerPoint } = coordinates as CircleCoordinate<PmMetadata> & {
                radius: number;
                centerPoint: Point;
            };

            this.metadata = { d: metadata.d };

            this.circlePoints.push({ point: { x: centerPoint.x, y: centerPoint.y * -1 }, d: metadata.d });
        });
    }

    public drawLine(value: CircleFormValue): void {
        this.circlePoints = [];
        this.onDrawCircle.emit(value);
    }

    private getInitialMetadata(): PmMetadata {
        return {
            d: 0,
        };
    }
}

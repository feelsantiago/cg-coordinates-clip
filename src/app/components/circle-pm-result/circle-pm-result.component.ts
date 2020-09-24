import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewService } from '../../services/view.service';
import { PmMetadata } from '../../types/lines';
import { CircleCoordinate } from '../../types/circle';
import { Point, NormalizedRange, ViewPort } from '../../types/coordinates';
import { CircleFormValue, CircleInputsComponent } from '../circle-inputs/circle-inputs.component';

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
    @Input()
    public viewPortWidth: number;

    @Input()
    public viewPortHeight: number;

    @Input()
    public centerPoint: Point;

    @Output()
    public onDrawCircle: EventEmitter<CircleFormValue>;

    public metadata: PmMetadata;

    public circlePoints: CirclePoint[];

    @ViewChild(CircleInputsComponent, { static: false })
    private circleInput: CircleInputsComponent;

    private subscriptions: SubSink;

    constructor(private readonly coordinateService: CoordinatesService, private readonly viewService: ViewService) {
        this.onDrawCircle = new EventEmitter();
        this.subscriptions = new SubSink();
        this.circlePoints = [{ d: 0, point: { x: 0, y: 0 } }];
    }

    public ngOnInit(): void {
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.circleInput.cleanForm();
            this.metadata = this.getInitialMetadata();
            this.circlePoints = [{ d: 0, point: { x: 0, y: 0 } }];
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { metadata, radius } = coordinates as CircleCoordinate<PmMetadata> & {
                radius: number;
            };

            let point = { x: 0, y: 0 };
            if (this.centerPoint) point = this.transformPoint(this.centerPoint);

            this.metadata = { d: metadata.d };

            this.circlePoints.push({ point, d: metadata.d });
        });
    }

    public drawLine(value: CircleFormValue): void {
        this.circlePoints = [];
        this.onDrawCircle.emit(value);
    }

    private transformPoint(point: Point): Point {
        let result: Point;

        if (point) {
            const viewPort = this.getViewPortDimensions();
            result = this.coordinateService.transformWorldToDevice(viewPort, viewPort, point, NormalizedRange.center);
        }

        return result;
    }

    private getViewPortDimensions(): ViewPort {
        return {
            x: {
                min: 0,
                max: this.viewPortWidth,
            },
            y: {
                min: 0,
                max: this.viewPortHeight,
            },
        };
    }

    private getInitialMetadata(): PmMetadata {
        return {
            d: 0,
        };
    }
}

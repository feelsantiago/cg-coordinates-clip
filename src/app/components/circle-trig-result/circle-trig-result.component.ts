import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewService } from '../../services/view.service';
import { CircleCoordinate, TrigonometricMetadata } from '../../types/circle';
import { NormalizedRange, Point, ViewPort } from '../../types/coordinates';
import { CircleFormValue, CircleInputsComponent } from '../circle-inputs/circle-inputs.component';

@Component({
    selector: 'app-circle-trig-result',
    templateUrl: './circle-trig-result.component.html',
    styleUrls: ['./circle-trig-result.component.scss']
})
export class CircleTrigResultComponent implements OnInit {
    @Input()
    public viewPortWidth: number;

    @Input()
    public viewPortHeight: number;

    @Input()
    public centerPoint: Point;

    @Output()
    public onDrawCircle: EventEmitter<CircleFormValue>;

    public metadata: TrigonometricMetadata;

    @ViewChild(CircleInputsComponent, { static: false })
    private circleInput: CircleInputsComponent;

    private subscriptions: SubSink;

    constructor(private readonly coordinateService: CoordinatesService, private readonly viewService: ViewService) {
        this.onDrawCircle = new EventEmitter();
        this.subscriptions = new SubSink();
    }

    public ngOnInit(): void {
        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.circleInput.cleanForm();
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { metadata, radius } = coordinates as CircleCoordinate<CircleFormValue> & {
                radius: number;
            };

            console.log(metadata);

            let point = { x: 0, y: 0 };
            if (this.centerPoint) point = this.transformPoint(this.centerPoint);

            this.circleInput.setMetadataForm({
                x: point.x,
                y: point.y,
                radius,
            });
        });
    }

    public drawLine(value: CircleFormValue): void {
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
}

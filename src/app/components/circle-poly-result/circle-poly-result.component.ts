import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewService } from '../../services/view.service';
import { NormalizedRange, Point, ViewPort } from '../../types/coordinates';
import { CircleCoordinate, PolynomialMetadata } from '../../types/circle';

export interface PolyFormValue {
    x: number;
    y: number;
    radius: number;
}

@Component({
    selector: 'app-circle-poly-result',
    templateUrl: './circle-poly-result.component.html',
    styleUrls: ['./circle-poly-result.component.scss'],
})
export class CirclePolyResultComponent implements OnInit {
    @Input()
    public viewPortWidth: number;

    @Input()
    public viewPortHeight: number;

    @Input()
    public centerPoint: Point;

    @Output()
    public onDrawCircle: EventEmitter<PolyFormValue>;

    public points: Point[];

    public metadata: PolynomialMetadata;

    public polyForm: FormGroup;

    private subscriptions: SubSink;

    constructor(
        private readonly fb: FormBuilder,
        private readonly coordinateService: CoordinatesService,
        private readonly viewService: ViewService,
    ) {
        this.onDrawCircle = new EventEmitter();
        this.subscriptions = new SubSink();
    }

    public ngOnInit(): void {
        this.initForm();
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.polyForm.reset();
            this.metadata = this.getInitialMetadata();
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { metadata, radius } = coordinates as CircleCoordinate<PolynomialMetadata> & {
                radius: number;
            };

            let point = { x: 0, y: 0 };
            if (this.centerPoint) point = this.transformPoint(this.centerPoint);

            this.metadata = {
                x: metadata.x + point.x,
                xEnd: metadata.xEnd + point.x,
            };

            this.polyForm.setValue({
                x: point.x,
                y: point.y,
                radius,
            });
        });
    }

    public onFormSubmit(): void {
        const value = this.polyForm.value as PolyFormValue;
        this.onDrawCircle.emit(value);
    }

    private initForm(): void {
        this.polyForm = this.fb.group({
            x: [0, Validators.required],
            y: [0, Validators.required],
            radius: [0, Validators.required],
        });
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

    private getInitialMetadata(): PolynomialMetadata {
        return {
            x: 0,
            xEnd: 0,
        };
    }
}

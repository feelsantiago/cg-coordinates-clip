import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ViewService } from '../../services/view.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { Point, ViewPort, NormalizedRange } from '../../types/coordinates';
import { PmMetadata, LineCoordinate } from '../../types/lines';

interface LinePoint {
    point: Point;
    d: number;
}

export interface PmFormValue {
    startPointX: number;
    startPointY: number;
    endPointX: number;
    endPointY: number;
}

@Component({
    selector: 'app-line-pm-result',
    templateUrl: './line-pm-result.component.html',
    styleUrls: ['./line-pm-result.component.scss'],
})
export class LinePmResultComponent implements OnInit {
    @Input()
    public metadata: PmMetadata;

    @Input()
    public point: Point;

    private subscriptions: SubSink;

    @Input()
    public startPoint: Point;

    public pmForm: FormGroup;

    @Input()
    public viewPortWidth: number;

    @Input()
    public viewPortHeight: number;

    @Output()
    public onDrawLine: EventEmitter<PmFormValue>;

    public linePoints: LinePoint[];

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

    constructor(
        private readonly coordinateService: CoordinatesService,
        private readonly viewService: ViewService,
        private readonly fb: FormBuilder,
    ) {
        this.subscriptions = new SubSink();
        this.onDrawLine = new EventEmitter();
        this.linePoints = [{ d: 0, point: { x: 0, y: 0 } }];
    }

    public ngOnInit(): void {
        this.initForm();

        this.point = { x: 0, y: 0 };
        this.startPoint = { x: 0, y: 0 };
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { point, metadata, start } = coordinates as LineCoordinate<PmMetadata> & { start: Point };

            this.point = this.transformPoint(point);
            this.startPoint = this.transformPoint(start);
            this.metadata = metadata;

            this.linePoints.push({ point: this.point, d: metadata.d });

            this.pmForm.setValue({
                startPointX: this.startPoint.x,
                startPointY: this.startPoint.y * -1,
                endPointX: this.point.x,
                endPointY: this.point.y * -1,
            });
        });

        this.viewService.clean$.subscribe(() => {
            this.pmForm.reset();
            this.metadata = this.getInitialMetadata();
            this.linePoints = [{ d: 0, point: { x: 0, y: 0 } }];
        });
    }

    private initForm(): void {
        this.pmForm = this.fb.group({
            startPointX: [0, Validators.required],
            startPointY: [0, Validators.required],
            endPointX: [0, Validators.required],
            endPointY: [0, Validators.required],
        });
    }

    public onFormSubmit(): void {
        this.linePoints = [];
        const value = this.pmForm.value as PmFormValue;
        this.onDrawLine.emit(value);
    }

    private transformPoint(point: Point): Point {
        let result: Point;

        if (point) {
            result = this.coordinateService.transformWorldToDevice(
                this.viewPort,
                this.viewPort,
                point,
                NormalizedRange.center,
            );
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

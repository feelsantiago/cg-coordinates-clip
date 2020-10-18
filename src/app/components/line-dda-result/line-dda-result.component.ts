import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ViewService } from '../../services/view.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { Point, ViewPort, NormalizedRange } from '../../types/coordinates';
import { DdaMetadata, LineCoordinate } from '../../types/lines';

export interface DdaFormValue {
    startPointX: number;
    startPointY: number;
    endPointX: number;
    endPointY: number;
}

@Component({
    selector: 'app-line-dda-result',
    templateUrl: './line-dda-result.component.html',
    styleUrls: ['./line-dda-result.component.scss'],
})
export class LineDdaResultComponent implements OnDestroy {
    @Input()
    public viewPortWidth: number;

    @Input()
    public viewPortHeight: number;

    @Output()
    public onDrawLine: EventEmitter<DdaFormValue>;

    public startPoint: Point;

    public point: Point;

    public metadata: DdaMetadata;

    public ddaForm: FormGroup;

    private subscriptions: SubSink;

    constructor(
        private readonly fb: FormBuilder,
        private readonly coordinateService: CoordinatesService,
        private readonly viewService: ViewService,
    ) {
        this.onDrawLine = new EventEmitter();
        this.subscriptions = new SubSink();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {
        this.initForm();

        this.point = { x: 0, y: 0 };
        this.startPoint = { x: 0, y: 0 };
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.ddaForm.reset();
            this.metadata = this.getInitialMetadata();
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { point, metadata, start } = coordinates as LineCoordinate<DdaMetadata> & { start: Point };

            this.point = this.transformPoint(point);
            this.startPoint = this.transformPoint(start);
            this.metadata = metadata;

            this.ddaForm.setValue({
                startPointX: this.startPoint.x,
                startPointY: this.startPoint.y * -1,
                endPointX: this.point.x,
                endPointY: this.point.y * -1,
            });
        });
    }

    public onFormSubmit(): void {
        const value = this.ddaForm.value as DdaFormValue;
        this.onDrawLine.emit(value);
    }

    private transformPoint(point: Point): Point {
        let result: Point;

        if (point) {
            const viewPort = this.getViewPortDimensions();
            result = this.coordinateService.transformWorldToDevice(viewPort, viewPort, point, NormalizedRange.center);
        }

        return result;
    }

    private initForm(): void {
        this.ddaForm = this.fb.group({
            startPointX: [0, Validators.required],
            startPointY: [0, Validators.required],
            endPointX: [0, Validators.required],
            endPointY: [0, Validators.required],
        });
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

    private getInitialMetadata(): DdaMetadata {
        return {
            dx: 0,
            dy: 0,
            steps: 0,
            xIncrement: 0,
            yIncrement: 0,
        };
    }
}

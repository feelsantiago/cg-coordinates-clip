import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoordinatesService } from '../../services/coordinates.service';
import { Point, ViewPort, NormalizedRange } from '../../types/coordinates';
import { DdaMetadata } from '../../types/lines';

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
export class LineDdaResultComponent {
    @Input()
    public metadata: DdaMetadata;

    @Input()
    public point: Point;

    @Input()
    public startPoint: Point;

    @Input()
    public viewPortWidth: number;

    @Input()
    public viewPortHeight: number;

    @Output()
    public onDrawLine: EventEmitter<DdaFormValue>;

    public ddaForm: FormGroup;

    constructor(private readonly fb: FormBuilder, private readonly coordinateService: CoordinatesService) {
        this.onDrawLine = new EventEmitter();
    }

    public ngOnInit(): void {
        this.initForm();

        this.point = { x: 0, y: 0 };
        this.startPoint = { x: 0, y: 0 };

        this.metadata = {
            dx: 0,
            dy: 0,
            steps: 0,
            xIncrement: 0,
            yIncrement: 0,
        };
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const { point, startPoint } = changes;

        if (point && point.currentValue) {
            this.point = this.transformPoint(point.currentValue);
        }

        if (startPoint && startPoint.currentValue) {
            this.startPoint = this.transformPoint(startPoint.currentValue);
        }

        if (this.ddaForm) {
            this.ddaForm.setValue({
                startPointX: this.startPoint.x,
                startPointY: this.startPoint.y * -1,
                endPointX: this.point.x,
                endPointY: this.point.y * -1,
            });
        }
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
}

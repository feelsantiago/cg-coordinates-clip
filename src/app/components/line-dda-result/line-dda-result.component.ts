import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CoordinatesService } from '../../services/coordinates.service';
import { Point, ViewPort, NormalizedRange } from '../../types/coordinates';
import { DdaMetadata, DdaFixValue } from '../../types/lines';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

    @Output()
    public onDrawLine: EventEmitter<DdaFixValue>;

    public ddaForm: FormGroup;

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

    constructor(private readonly fb: FormBuilder, private readonly coordinateService: CoordinatesService) {
        this.onDrawLine = new EventEmitter;
    }

    public ngOnInit(): void {
        this.initForm();

        if (!this.metadata) {
            this.metadata = {
                dx: 0,
                dy: 0,
                steps: 0,
                xIncrement: 0,
                yIncrement: 0
            }
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.transformPoint(changes.point.currentValue);
    }

    public onFormSubmit(): void {
        const value = this.ddaForm.value as DdaFixValue;
        this.onDrawLine.emit(value);
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

    private initForm(): void {
        this.ddaForm = this.fb.group({
            startPointX: [0, Validators.required],
            startPointY: [0, Validators.required],
            endPointX: [0, Validators.required],
            endPointY: [0, Validators.required],
        });
    }
}

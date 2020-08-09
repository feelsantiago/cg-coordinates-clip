import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoordinatesService } from '../../services/coordinates.service';
import { NormalizedRange, ViewPort, Point } from '../../types/coordinates';

interface CoordinateForm {
    worldXMin: number;
    worldXMax: number;
    worldYMin: number;
    worldYMax: number;
    normalizedRange: NormalizedRange;
    deviceX: number;
    deviceY: number;
    pointX: number;
    pointY: number;
}

@Component({
    selector: 'app-input-coordinates',
    styleUrls: ['./input-coordinates.component.scss'],
    templateUrl: './input-coordinates.component.html',
})
export class InputCoordinatesComponent implements OnInit {
    public coordinateForm: FormGroup;

    constructor(private readonly fb: FormBuilder, private readonly coordinateService: CoordinatesService) {}

    public ngOnInit(): void {
        this.initForm();
    }

    public onFormSubmit(): void {
        const value = this.coordinateForm.value as CoordinateForm;
        const [world, device, point, range] = this.mapFormValueToTransformValue(value);
        this.coordinateService.transformAndEmit(world, device, point, range);
    }

    private mapFormValueToTransformValue(value: CoordinateForm): [ViewPort, ViewPort, Point, NormalizedRange] {
        const { normalizedRange } = value;

        const worldViewPort: ViewPort = {
            x: {
                min: value.worldXMin,
                max: value.worldXMax,
            },
            y: {
                min: value.worldYMin,
                max: value.worldYMax,
            },
        };

        const deviceViewPort: ViewPort = {
            x: {
                min: 0,
                max: value.deviceX,
            },
            y: {
                min: 0,
                max: value.deviceY,
            },
        };

        const point: Point = {
            x: value.pointX,
            y: value.pointY,
        };

        return [worldViewPort, deviceViewPort, point, normalizedRange];
    }

    private initForm(): void {
        this.coordinateForm = this.fb.group({
            worldXMin: [0, Validators.required],
            worldXMax: [0, Validators.required],
            worldYMin: [0, Validators.required],
            worldYMax: [0, Validators.required],
            normalizedRange: ['origin', Validators.required],
            deviceX: [0, Validators.required],
            deviceY: [0, Validators.required],
            pointX: [0, Validators.required],
            pointY: [0, Validators.required],
        });
    }
}

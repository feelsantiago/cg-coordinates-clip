import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CircleFormValue {
    x: number;
    y: number;
    radius: number;
}

@Component({
    selector: 'app-circle-inputs',
    templateUrl: './circle-inputs.component.html',
    styleUrls: ['./circle-inputs.component.scss'],
})
export class CircleInputsComponent implements OnInit {
    @Output()
    public drawLine: EventEmitter<CircleFormValue>;

    public circleForm: FormGroup;

    constructor(private readonly fb: FormBuilder) {
        this.drawLine = new EventEmitter();
    }

    public ngOnInit(): void {
        this.initForm();
    }

    public setMetadataForm({ x, y, radius }: CircleFormValue): void {
        this.circleForm.setValue({ x, y, radius });
    }

    public onFormSubmit(): void {
        const value = this.circleForm.value as CircleFormValue;
        this.drawLine.emit(value);
    }

    public cleanForm(): void {
        this.circleForm.reset();
    }

    private initForm(): void {
        this.circleForm = this.fb.group({
            x: [0, Validators.required],
            y: [0, Validators.required],
            radius: [0, Validators.required],
        });
    }
}

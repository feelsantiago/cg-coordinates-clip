import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ViewService } from '../../services/view.service';
import { Point } from '../../types/coordinates';

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

    private subscriptions: SubSink;

    constructor(private readonly fb: FormBuilder, private readonly viewService: ViewService) {
        this.drawLine = new EventEmitter();
        this.subscriptions = new SubSink();
    }

    public ngOnInit(): void {
        this.initForm();

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { radius, centerPoint } = coordinates as {
                radius: number;
                centerPoint: Point;
            };

            this.circleForm.setValue({
                x: centerPoint.x,
                y: centerPoint.y,
                radius,
            });
        });

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.circleForm.reset();
        });
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

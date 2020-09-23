import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { TrigonometricMetadata } from '../../types/circle';
import { Point } from '../../types/coordinates';

export interface TrigFormValue {
    x: number;
    y: number;
    radius: number;
}

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
    public onDrawCircle: EventEmitter<TrigFormValue>;

    public points: Point[];

    public metadata: TrigonometricMetadata;

    public trigForm: FormGroup;

    private subscriptions: SubSink;

    constructor() {}

    ngOnInit(): void {}

    public onFormSubmit(): void {
        const value = this.trigForm.value as TrigFormValue;
        this.onDrawCircle.emit(value);
    }
}

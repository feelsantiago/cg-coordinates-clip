import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { ViewService } from '../../services/view.service';
import { CircleCoordinate, TrigonometricMetadata } from '../../types/circle';
import { Point } from '../../types/coordinates';
import { CircleFormValue } from '../circle-inputs/circle-inputs.component';

@Component({
    selector: 'app-circle-trig-result',
    templateUrl: './circle-trig-result.component.html',
    styleUrls: ['./circle-trig-result.component.scss'],
})
export class CircleTrigResultComponent implements OnInit {
    @Output()
    public onDrawCircle: EventEmitter<CircleFormValue>;

    public centerPoint: Point = { x: 0, y: 0 };

    public radius = 0;

    public metadata: TrigonometricMetadata;

    private subscriptions: SubSink;

    constructor(private readonly viewService: ViewService) {
        this.onDrawCircle = new EventEmitter();
        this.subscriptions = new SubSink();
    }

    public ngOnInit(): void {
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.metadata = this.getInitialMetadata();
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { metadata } = coordinates as CircleCoordinate<TrigonometricMetadata> & {
                radius: number;
                centerPoint: Point;
            };

            this.metadata = metadata;
        });
    }

    public drawLine(value: CircleFormValue): void {
        this.onDrawCircle.emit(value);
    }

    private getInitialMetadata(): TrigonometricMetadata {
        return {
            teta: 0,
        };
    }
}

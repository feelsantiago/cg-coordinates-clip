import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { CoordinatesService } from '../../services/coordinates.service';
import { ViewService } from '../../services/view.service';
import { Point } from '../../types/coordinates';
import { CircleCoordinate, PolynomialMetadata } from '../../types/circle';
import { CircleFormValue } from '../circle-inputs/circle-inputs.component';

@Component({
    selector: 'app-circle-poly-result',
    templateUrl: './circle-poly-result.component.html',
    styleUrls: ['./circle-poly-result.component.scss'],
})
export class CirclePolyResultComponent implements OnInit {
    @Output()
    public onDrawCircle: EventEmitter<CircleFormValue>;

    public centerPoint: Point = { x: 0, y: 0 };

    public radius = 0;

    public metadata: PolynomialMetadata;

    private subscriptions: SubSink;

    constructor(private readonly coordinateService: CoordinatesService, private readonly viewService: ViewService) {
        this.onDrawCircle = new EventEmitter();
        this.subscriptions = new SubSink();
    }

    public ngOnInit(): void {
        this.metadata = this.getInitialMetadata();

        this.subscriptions.sink = this.viewService.clean$.subscribe(() => {
            this.metadata = this.getInitialMetadata();
        });

        this.subscriptions.sink = this.viewService.metadata$.subscribe((coordinates) => {
            const { metadata, centerPoint } = coordinates as CircleCoordinate<PolynomialMetadata> & {
                radius: number;
                centerPoint: Point;
            };

            this.metadata = {
                x: metadata.x + centerPoint.x,
                xEnd: metadata.xEnd + centerPoint.x,
            };
        });
    }

    public drawLine(value: CircleFormValue): void {
        this.onDrawCircle.emit(value);
    }

    private getInitialMetadata(): PolynomialMetadata {
        return {
            x: 0,
            xEnd: 0,
        };
    }
}

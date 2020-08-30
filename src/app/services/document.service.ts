import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { MouseCoordinatesEvent } from '../types/events';
import { Point } from '../types/coordinates';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    public onMouseMove$: Observable<MouseCoordinatesEvent>;

    constructor() {
        this.onMouseMove$ = fromEvent(document, 'mousemove').pipe(
            map((event) => event as MouseEvent),
            map((event) => ({
                x: event.x,
                y: event.y,
            })),
        );
    }

    public transformGlobalMouseCoordinatesToLocal(
        point: Point,
        localOffSetTop: number,
        localOffsetLeft: number,
    ): Point {
        const x = point.x - localOffsetLeft;
        const y = point.y - localOffSetTop;

        return { x, y };
    }
}

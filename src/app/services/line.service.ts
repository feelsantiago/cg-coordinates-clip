import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point } from '../types/coordinates';

@Injectable({ providedIn: 'root' })
export class LineService {
    public dda(start: Point, end: Point): Observable<Point> {
        return new Observable<Point>((subscriber) => {
            this.calculateDDA(start, end, (point) => subscriber.next(point));
            subscriber.complete();
        });
    }

    private calculateDDA(start: Point, end: Point, setPixel: (point: Point) => void): void {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        let steps: number;
        let { x } = start;
        let { y } = start;

        if (Math.abs(dx) > Math.abs(dy)) steps = Math.abs(dx);
        else steps = Math.abs(dy);

        const xIncrement = dx / steps;
        const yIncrement = dy / steps;

        setPixel({ x: this.round(x), y: this.round(y) });

        for (let i = 0; i < steps; i++) {
            x += xIncrement;
            y += yIncrement;

            setPixel({ x: this.round(x), y: this.round(y) });
        }
    }

    private round(value: number): number {
        const float = value + 0.5;
        return Number.parseInt(float.toFixed(0), 10);
    }
}

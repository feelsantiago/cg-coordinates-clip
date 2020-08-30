import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point } from '../types/coordinates';
import { DdaMetadata, LineCoordinate } from '../types/lines';

@Injectable({ providedIn: 'root' })
export class LineService {
    public dda(start: Point, end: Point): Observable<LineCoordinate<DdaMetadata>> {
        return new Observable<LineCoordinate<DdaMetadata>>((subscriber) => {
            this.calculateDda(start, end, (point, metadata) => subscriber.next({ point, metadata }));
            subscriber.complete();
        });
    }

    public pm(start: Point, end: Point): Observable<Point> {
        return new Observable<Point>((subscriber) => {
            this.calculatePm(start, end, (point) => subscriber.next(point));
            subscriber.complete();
        });
    }

    private calculatePm(start: Point, end: Point, setPixel: (point: Point) => void): void {
        const dx = Math.abs(end.x - start.x);
        const dy = Math.abs(end.y - start.y);

        const eIncrement = 2 * dy;
        const neIncrement = 2 * (dy - dx);

        let increment = 2 * dy - dx;
        let { x, y } = start;
        let xEnd = end.x;

        if (x > xEnd) {
            x = end.x;
            y = end.y;
            xEnd = x;
        }

        setPixel({ x, y });

        while (x < xEnd) {
            x++;
            if (increment < 0) {
                increment += eIncrement;
            } else {
                y++;
                increment = neIncrement;
            }

            setPixel({ x, y });
        }
    }

    private calculateDda(start: Point, end: Point, setPixel: (point: Point, metadata?: DdaMetadata) => void): void {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        let steps: number;
        let { x, y } = start;

        if (Math.abs(dx) > Math.abs(dy)) steps = Math.abs(dx);
        else steps = Math.abs(dy);

        const xIncrement = dx / steps;
        const yIncrement = dy / steps;

        const metadata: DdaMetadata = {
            dx,
            dy,
            steps,
            xIncrement,
            yIncrement,
        };

        setPixel({ x: this.round(x), y: this.round(y) }, metadata);

        for (let i = 0; i < steps; i++) {
            x += xIncrement;
            y += yIncrement;

            metadata.xIncrement = xIncrement;
            metadata.yIncrement = yIncrement;

            setPixel({ x: this.round(x), y: this.round(y) }, metadata);
        }
    }

    private round(value: number): number {
        const float = value + 0.5;
        return Number.parseInt(float.toFixed(0), 10);
    }
}

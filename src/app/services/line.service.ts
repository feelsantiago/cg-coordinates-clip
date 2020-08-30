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

    public pm(start: Point, end: Point): Observable<LineCoordinate<unknown>> {
        return new Observable<LineCoordinate<unknown>>((subscriber) => {
            this.calculatePm(start, end, (point) => subscriber.next({ point, metadata: '' }));
            subscriber.complete();
        });
    }

    private calculatePm(start: Point, end: Point, setPixel: (point: Point) => void): void {
        let { x, y } = start;

        if (x === end.x && y === end.y) {
            setPixel({ x, y });
        } else {
            const dx = Math.abs(end.x - start.x);
            const dy = Math.abs(end.y - start.y);
            let slope = dx - dy;

            let xIncrement = 1;
            let yIncrement = 1;

            if (x > end.x) {
                xIncrement = -1;
            }

            if (y > end.y) {
                yIncrement = -1;
            }

            setPixel({ x, y });

            while (x !== end.x || y !== end.y) {
                const p = 2 * slope;

                if (p > -dy) {
                    slope -= dy;
                    x += xIncrement;
                }

                if (p < dx) {
                    slope += dx;
                    y += yIncrement;
                }

                setPixel({ x, y });
            }
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

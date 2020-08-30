import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point } from '../types/coordinates';
import { DDAMetadata, LineCoordinate } from '../types/lines';

@Injectable({ providedIn: 'root' })
export class LineService {
    public dda(start: Point, end: Point): Observable<LineCoordinate<DDAMetadata>> {
        return new Observable<LineCoordinate<DDAMetadata>>((subscriber) => {
            this.calculateDDA(start, end, (point, metadata) => subscriber.next({ point, metadata }));
            subscriber.complete();
        });
    }

    private calculateDDA(start: Point, end: Point, setPixel: (point: Point, metadata?: DDAMetadata) => void): void {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        let steps: number;
        let { x } = start;
        let { y } = start;

        if (Math.abs(dx) > Math.abs(dy)) steps = Math.abs(dx);
        else steps = Math.abs(dy);

        const xIncrement = dx / steps;
        const yIncrement = dy / steps;

        const metadata: DDAMetadata = {
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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CircleCoordinate, PolynomialMetadata, TrigonometricMetadata } from '../types/circle';
import { Point } from '../types/coordinates';
import { PmMetadata } from '../types/lines';

@Injectable({ providedIn: 'root' })
export class CircleService {
    public calculateRadius(startPoint: Point, endPoint: Point): number {
        let { x } = startPoint;
        let xEnd = endPoint.x;

        if (x < xEnd) {
            const temp = x;
            x = xEnd;
            xEnd = temp;
        }

        return Math.abs(xEnd - x);
    }

    public polynomial(radius: number): Observable<CircleCoordinate<PolynomialMetadata>> {
        return new Observable<CircleCoordinate<PolynomialMetadata>>((subscriber) => {
            this.calculatePolynomial(radius, (points, metadata) => subscriber.next({ points, metadata }));
            subscriber.complete();
        });
    }

    public trigonometric(radius: number): Observable<CircleCoordinate<TrigonometricMetadata>> {
        return new Observable<CircleCoordinate<TrigonometricMetadata>>((subscriber) => {
            this.calculateTrigonometric(radius, (points, metadata) => subscriber.next({ points, metadata }));
            subscriber.complete();
        });
    }

    public pm(radius: number): Observable<CircleCoordinate<PmMetadata>> {
        return new Observable<CircleCoordinate<PmMetadata>>((subscriber) => {
            this.calculatePm(radius, (points, metadata) => subscriber.next({ points, metadata }));
            subscriber.complete();
        });
    }

    private calculatePolynomial(
        radius: number,
        setPixels: (points: Point[], metadata?: PolynomialMetadata) => void,
    ): void {
        let x = 0;
        const xEnd = radius / Math.sqrt(2);

        while (x <= xEnd) {
            const y = Math.sqrt(radius ** 2 - x ** 2);

            const points = this.getCirclePoints({ x: Math.round(x), y: Math.round(y) });
            setPixels(points, { x, xEnd });
            x++;
        }
    }

    private calculateTrigonometric(
        radius: number,
        setPixels: (points: Point[], metadata?: TrigonometricMetadata) => void,
    ): void {
        let teta = 0;

        while (teta <= 45) {
            const x = radius * Math.cos(teta);
            const y = radius * Math.sin(teta);

            const points = this.getCirclePoints({ x: Math.round(x), y: Math.round(y) });
            setPixels(points, { teta });
            teta++;
        }
    }

    private calculatePm(radius: number, setPixels: (points: Point[], metadata?: PmMetadata) => void): void {
        let x = 0;
        let y = radius;
        let d = 1 - radius;

        setPixels(this.getCirclePoints({ x, y }), { d });

        while (y > x) {
            if (d < 0) {
                d += 2 * x + 3;
            } else {
                d += 2 * (x - y) + 5;
                y--;
            }

            x++;
            setPixels(this.getCirclePoints({ x, y }), { d });
        }
    }

    private getCirclePoints(point: Point): Point[] {
        const { x, y } = point;
        return [
            { x, y },
            { x: y, y: x },
            { x: y, y: -x },
            { x, y: -y },
            { x: -x, y: -y },
            { x: -y, y: -x },
            { x: -y, y: x },
            { x: -x, y },
        ];
    }
}

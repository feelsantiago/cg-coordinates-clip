import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point } from '../types/coordinates';

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

    public polynomial(radius: number): Observable<Point[]> {
        return new Observable<Point[]>((subscriber) => {
            this.calculatePolynomial(radius, (points) => subscriber.next(points));
            subscriber.complete();
        });
    }

    public trigonometric(radius: number): Observable<Point[]> {
        return new Observable<Point[]>((subscriber) => {
            this.calculateTrigonometric(radius, (points) => subscriber.next(points));
            subscriber.complete();
        });
    }

    public pm(radius: number): Observable<Point[]> {
        return new Observable<Point[]>((subscriber) => {
            this.calculatePm(radius, (points) => subscriber.next(points));
            subscriber.complete();
        });
    }

    private calculatePolynomial(radius: number, setPixels: (points: Point[]) => void): void {
        let x = 0;
        const xEnd = radius / Math.sqrt(2);

        while (x <= xEnd) {
            const y = Math.sqrt(radius ** 2 - x ** 2);
            setPixels(this.getCirclePoints({ x: Math.round(x), y: Math.round(y) }));
            x++;
        }
    }

    private calculateTrigonometric(radius: number, setPixels: (points: Point[]) => void): void {
        let teta = 0;

        while (teta <= 45) {
            const x = radius * Math.cos(teta);
            const y = radius * Math.sin(teta);
            setPixels(this.getCirclePoints({ x: Math.round(x), y: Math.round(y) }));
            teta++;
        }
    }

    private calculatePm(radius: number, setPixels: (points: Point[]) => void): void {
        let x = 0;
        let y = radius;
        let d = 1 - radius;

        setPixels(this.getCirclePoints({ x, y }));

        while (y > x) {
            if (d < 0) {
                d += 2 * x + 3;
            } else {
                d += 2 * (x - y) + 5;
                y--;
            }

            x++;
            setPixels(this.getCirclePoints({ x, y }));
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

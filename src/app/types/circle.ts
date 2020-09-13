import { Point } from './coordinates';

export interface PolynomialMetadata {
    x: number;
    xEnd: number;
}

export interface TrigonometricMetadata {
    teta: number;
}

export interface CircleCoordinate<T> {
    points: Point[];
    metadata: T;
}

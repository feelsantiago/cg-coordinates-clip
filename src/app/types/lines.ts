import { Point } from './coordinates';

export interface DdaMetadata {
    dx: number;
    dy: number;
    steps: number;
    xIncrement: number;
    yIncrement: number;
}

export interface PmMetadata {
    d: number;
}

export interface LineCoordinate<T> {
    point: Point;
    metadata: T;
}

export interface DdaFixValue {
    startPointX: number;
    startPointY: number;
    endPointX: number;
    endPointY: number;
}
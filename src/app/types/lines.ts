import { Point } from './coordinates';

export interface DdaMetadata {
    dx: number;
    dy: number;
    steps: number;
    xIncrement: number;
    yIncrement: number;
}

export interface LineCoordinate<T extends DdaMetadata> {
    point: Point;
    metadata: T;
}

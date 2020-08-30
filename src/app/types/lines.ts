import { Point } from './coordinates';

export interface DDAMetadata {
    dx: number;
    dy: number;
    steps: number;
    xIncrement: number;
    yIncrement: number;
}

export interface LineCoordinate<T extends DDAMetadata> {
    point: Point;
    metadata: T;
}

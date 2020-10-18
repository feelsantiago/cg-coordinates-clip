import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ViewPort, Point, NormalizedRange, Range } from '../types/coordinates';

export interface TransformEvent {
    world: ViewPort;
    device: ViewPort;
    point: Point;
    range: Range;
    ndc: Point;
    dc: Point;
}

@Injectable({ providedIn: 'root' })
export class CoordinatesService {
    private originRange: Range = [0, 1];

    private centerRange: Range = [-1, 1];

    private onTransformation: Subject<TransformEvent>;

    public get onTransformation$(): Subject<TransformEvent> {
        return this.onTransformation;
    }

    constructor() {
        this.onTransformation = new Subject();
    }

    /**
     * Transform world coordinate into device coordinate and emit all values
     * @param world World size definition (Width | Height) [yMin, yMin] < [x, y] < [xMan, yMax]
     * @param device Device size resolution (Width | Height)
     * @param point Arbitrary point in the world coordinates
     * @param range Origin: [0, 1] | Center: [-1, 1]. Default to origin.
     */
    public transformAndEmit(world: ViewPort, device: ViewPort, point: Point, range: NormalizedRange): void {
        const ndc = this.worldToNdc(point, world, range);
        const dc = this.ndcToDevice(ndc, device);
        const nRange = range === NormalizedRange.origin ? this.originRange : this.centerRange;

        this.onTransformation.next({ world, device, point, range: nRange, ndc, dc });
    }

    /**
     * Transform a world coordinate into device coordinate
     * @param world World size definition (Width | Height) [yMin, yMin] < [x, y] < [xMan, yMax]
     * @param device Device size resolution (Width | Height)
     * @param point Arbitrary point in the world coordinates
     * @param range Origin: [0, 1] | Center: [-1, 1]. Default to origin.
     */
    public transformWorldToDevice(world: ViewPort, device: ViewPort, point: Point, range: NormalizedRange): Point {
        const ndc = this.worldToNdc(point, world, range);
        return this.ndcToDevice(ndc, device);
    }

    /**
     * Transforms world coordinates into normalized coordinates
     * @param point Arbitrary point in the world coordinates
     * @param viewPort World size definition (Width | Height) [yMin, yMin] < [x, y] < [xMan, yMax]
     * @param range Origin: [0, 1] | Center: [-1, 1]. Default to origin.
     */
    public worldToNdc(point: Point, viewPort: ViewPort, range: NormalizedRange = NormalizedRange.origin): Point {
        const { x, y } = point;
        const [ndcMin, ndcMax] = range === NormalizedRange.origin ? this.originRange : this.centerRange;

        // (ndc[x, y] - ndcMin) / ndcMax - ndcMin = [x, y] - [xMin, yMin] / [xMax, yMax] - [xMin, yMin]
        const ndc = ndcMax - ndcMin;
        const pointX = x - viewPort.x.min;
        const pointY = y - viewPort.y.min;
        const rangeX = viewPort.x.max - viewPort.x.min;
        const rangeY = viewPort.y.max - viewPort.y.min;

        const ndcx = ndc * (pointX / rangeX) + ndcMin;
        const ndcy = ndc * (pointY / rangeY) + ndcMin;

        return { x: ndcx, y: ndcy };
    }

    /**
     * Transform normalized coordinates to device view port coordinates. [0, 0] < [ndh -1, ndv - 1]
     * @param ndc Normalized point
     * @param viewPort Device size resolution (Width | Height)
     */
    public ndcToDevice(ndc: Point, viewPort: ViewPort): Point {
        const { x, y } = ndc;

        // dc[x, y] = round(ndc[x, y] * (nd[h, v] - 1))
        const dcx = Math.round(x * (viewPort.x.max - 1));
        const dcy = Math.round(y * (viewPort.y.max - 1));

        return { x: dcx, y: dcy };
    }

    public deviceToWorld(point: Point, world: ViewPort): Point {
        let { x, y } = point;

        x /= 2;
        y = (y / 2) * -1;

        const width = world.x.max / 2;
        const height = world.y.max / 2;

        x += width;
        y += height;

        return { x, y };
    }
}

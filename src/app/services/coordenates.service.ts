import { Injectable } from '@angular/core';
import { ViewPort, Point } from '../types/coordinates';

@Injectable({ providedIn: 'root' })
export class CoordinatesService {
    /**
     * Transforms world coordinates into normalized coordinates that ranges to [-1, -1] x [1, 1]
     * @param userCoordinates Arbitrary point in the world coordinates
     * @param userViewPort World size definition (Width | Height) [yMin, yMin] < [x, y] < [xMan, yMax]
     */
    public worldToNdc(worldPoint: Point, worldViewPort: ViewPort): Point {
        const { x, y } = worldPoint;

        // (ndc[x, y] - 1) / 1 - (-1) = [x, y] - [xMin, yMin] / [xMax, yMax] - [xMin, yMin]
        const ndcx = 2 * ((x - worldViewPort.x.min) / (worldViewPort.x.max - worldViewPort.x.min)) - 1;
        const ndcy = 2 * ((y - worldViewPort.y.min) / (worldViewPort.y.max - worldViewPort.y.min)) - 1;

        return { x: ndcx, y: ndcy };
    }

    /**
     * Transform normalized coordinates to device view port coordinates. [0, 0] < [ndh -1, ndv - 1]
     * @param ndc Normalized point
     * @param deviceViewPort Device size resolution (Width | Height)
     */
    public ndcToDevice(ndc: Point, deviceViewPort: ViewPort): Point {
        const { x, y } = ndc;

        // dc[x, y] = round(ndc[x, y] * (nd[h, v] - 1))
        const dcx = Math.round(x * (deviceViewPort.x.max - 1));
        const dcy = Math.round(y * (deviceViewPort.y.max - 1));

        // The values must be positive = 0 < dc[x, y] < nd[h, v]
        return { x: Math.abs(dcx), y: Math.abs(dcy) };
    }
}

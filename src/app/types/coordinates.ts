export interface Point {
    x: number;
    y: number;
}

export interface ViewPort {
    x: {
        min: number;
        max: number;
    };

    y: {
        min: number;
        max: number;
    };
}

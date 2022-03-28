export interface canvas {
    primaryColor: string;
    secondaryColor: string;
    width: number;
    current: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    set: (canvas: canvas) => void;
    init: (newCanvas: HTMLCanvasElement) => void;
}

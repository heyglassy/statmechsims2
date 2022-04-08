export interface simulation {
    currentUrl: string;
    localMagnetic: Array<Array<number>>;
    spin: Array<any>;
    spins: Array<Array<number>>;
    spinBefore: Array<any>;
    nearestNeighs: Object;
    clusteredChildren: Array<any>;
    wall: Array<Array<number>>;
    running: boolean,
    freePlay: boolean,
    freePlayIncrememt: boolean,
    frames: Array<string>;
    temperature: number;
    set: (query: object) => void;
}

import { Optional } from "./utils";

// TODO: Union type on currentURL

type test = Optional<simulation>;

export interface simulation {
  currentUrl: string;
  localMagnetic: Array<Array<number>>;
  spin: Array<any>;
  spins: Array<Array<number>>;
  spinBefore: Array<any>;
  nearestNeighs: Object;
  clusteredChildren: Array<any>;
  wall: Array<Array<number>>;
  running: boolean;
  freePlay: boolean;
  freePlayIncrememt: boolean;
  frames: Array<string>;
  temperature: number;
  calcStats: any;
  algo: any;
  energy: number;
  totalEnergy: number;
  magnetism: number;
  totalMagnetism: number;
  loopCount: number;
  set: (update: Optional<simulation>) => void;
}

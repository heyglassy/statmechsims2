import BlumeCapel, { ComputeEforBEG } from "../models/blume-capel";
import KawasakiLocal from "../models/kawasaki-local";
import KawasakiNonLocal, {
  ComputeEforKawasaki,
} from "../models/kawasaki-non-local";
import metropolis, { ComputeEforMetropolis } from "../models/metropolis";
import qpotts from "../models/q-potts";
import transverse from "../models/transverse-field-ising";
import wolff from "../models/wolff";
import xy from "../models/xy";

interface models {
  url: string;
  name: string;
  algo: () => void; //TODO: remove timestamp from parameters
  calcStats?: () => { Ecurrent: number; Mcurrent: number };
}

export const Models: Array<models> = [
  {
    url: "/models/metropolis",
    name: "Metropolis",
    algo: metropolis,
    calcStats: ComputeEforMetropolis,
  },
  {
    url: "/models/kawasaki-non-local",
    name: "Kawasaki (non-local)",
    algo: KawasakiNonLocal,
    calcStats: ComputeEforKawasaki,
  },
  {
    url: "/models/kawasaki-local",
    name: "Kawasaki (local)",
    algo: KawasakiLocal,
    calcStats: ComputeEforKawasaki,
  },
  {
    url: "/models/blume-capel",
    name: "Blume-Capel",
    algo: BlumeCapel,
    calcStats: ComputeEforBEG,
  },
  {
    url: "/models/wolff",
    name: "Wolff",
    algo: wolff,
    calcStats: ComputeEforMetropolis,
  },
  { url: "/models/xy", name: "XY", algo: xy },
  {
    url: "/models/transverse-field-ising",
    name: "Transverse-field Ising",
    algo: transverse,
  },
  { url: "/models/q-potts", name: "Q-Potts", algo: qpotts },
  { url: "/models/heatbath", name: "Heat Bath", algo: qpotts },
];

import BlumeCapel from "../models/blume-capel";
import KawasakiLocal from "../models/kawasaki-local";
import KawasakiNonLocal from "../models/kawasaki-non-local";
import metropolis from "../models/metropolis";
import qpotts from "../models/q-potts";
import transverse from "../models/transverse-field-ising";
import wolff from "../models/wolff";
import xy from "../models/xy";

interface models {
    url: string;
    name: string;
    algo: (timemstamp: number) => void; //TODO: remove timestamp from parameters
}

export const Models: Array<models> = [
    { url: "/models/metropolis", name: "Metropolis", algo: metropolis },
    { url: "/models/kawasaki-non-local", name: "Kawasaki (non-local)", algo: KawasakiNonLocal },
    { url: "/models/kawasaki-local", name: "Kawasaki (local)", algo: KawasakiLocal },
    { url: "/models/blume-capel", name: "Blume-Capel", algo: BlumeCapel },
    { url: "/models/wolff", name: "Wolff", algo: wolff },
    { url: "/models/xy", name: "XY", algo: xy },
    { url: "/models/transverse-field-ising", name: "Transverse-field Ising", algo: transverse },
    { url: "/models/q-potts", name: "Q-Potts", algo: qpotts },
];

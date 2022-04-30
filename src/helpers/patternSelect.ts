import { colorBEG } from "../models/blume-capel";
import Store2 from "../stores/store2";
import { color } from "./color";
import initSpins from "./initializers/spins";
import { alignSpins, setup } from "./setup";


export const MakePattern = (pattern: string) => {
    const { latticeSize } = Store2.getState().settings;

    let { spins, set, currentUrl } = Store2.getState().simulation

    switch (pattern) {
        case "Random":
            initSpins()
            setup(currentUrl)
            return;
        case "Align":
            initSpins()
            alignSpins(currentUrl)
            return;
        case "Cross":
            MakeCross();
            break;
        case "Thick X":
            MakeFatX();
            break;
        case "Thin X":
            MakeThinX();
            break;
        case "Horizontal":
            MakeHorizontal();
            break;
        case "Vertical":
            MakeVertical();
            break;
        case "SquareDrop":
            MakeSquare();
            break;
        case "3 Connected Beads":
            MakeBeads();
            break;
        case "5 Bead Network":
            MakeNetworkBeads();
            break;
        case "Diagonal":
            MakeDiagonal();
            break;
        case "Circular Droplet":
            MakeCircle();
            break;
        case "Annulus (Donut)":
            MakeDonut();
            break;
        case "Grating":
            MakeGrating();
            break;
        case "Dots":
            MakeDots();
            break;
        // case "Align":
        //     makeAllOneColor();
        //     break;
    }

    function MakeSquare() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (Math.abs((latticeSize / 2) - i) < latticeSize * 0.1 && Math.abs((latticeSize / 2) - j) < latticeSize * 0.1) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeGrating() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                spins[i][j] = 1;
            }
        }

        for (var m = 0; m < latticeSize; m++) {
            var c = 0;
            for (var n = 0; n < latticeSize; n += 3) {
                var g = n + c;
                var fa = m + c;
                spins[fa][g] = -1;
            }
            c += 5;
        }
    }


    function MakeDots() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                spins[i][j] = 1;
            }
        }

        for (var m = 0; m < latticeSize; m += 2) {
            for (var n = 0; n < latticeSize; n += 2) {
                spins[m][n] = -1;
            }
        }
    }


    function MakeFatX() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (i == j || i == latticeSize - j - 1 || i == j - 1 || i == latticeSize - j || i == j + 1 || i == latticeSize - j + 1 || i == j + 2 || i == latticeSize - j + 2 || i == j + 3 || i == latticeSize - j + 3 || i == j + 4 || i == latticeSize - j + 4 || i == j + 5 || i == latticeSize - j + 5 || i == j + 6 || i == latticeSize - j + 6 || i == j + 7 || i == latticeSize - j + 7 || i == j + 8 || i == latticeSize - j + 8 || i == j + 9 || i == latticeSize - j + 9 || i == j + 10 || i == latticeSize - j + 10) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeThinX() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (i == j || i == latticeSize - j - 1) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeCross() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (i == (latticeSize / 2) - 1 || j == (latticeSize / 2) - 1 || i == (latticeSize / 2) || j == (latticeSize / 2) || i == (latticeSize / 2) - 2 || j == (latticeSize / 2) - 2 || i == (latticeSize / 2) + 1 || j == (latticeSize / 2) + 1 || i == (latticeSize / 2) + 2 || j == (latticeSize / 2) + 2) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }


    function MakeVertical() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (Math.abs((latticeSize / 2) - i) < latticeSize * 0.1) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeHorizontal() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (Math.abs((latticeSize / 2) - j) < latticeSize * 0.1) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeBeads() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize * .15)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * .15)) ** 2) < (latticeSize / 2) || Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize * 1.9)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * 1.9)) ** 2) < latticeSize / 2 || Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize * 1.02)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * 1.02)) ** 2) < latticeSize / 2 || i == j || i == j - 1 || i == j + 1 || i == j + 2 || i == j - 2 || i == j + 3 || i == j - 3) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeNetworkBeads() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize * .15)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * .15)) ** 2) < (latticeSize / 2) || Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize * 1.9)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * 1.9)) ** 2) < latticeSize / 2 || Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize * 1.02)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * 1.02)) ** 2) < latticeSize / 2 || i == j || i == j - 1 || i == j + 1 || i == j + 2 || i == j - 2 || i == j + 3 || i == j - 3 || Math.sqrt((latticeSize / 2 - (j * 3)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize * 1.9)) ** 2) < latticeSize / 2 || Math.sqrt((latticeSize / 2 - (i * 3 - latticeSize * .1)) ** 2 + (latticeSize * 2.5 - j * 3 - 5) ** 2) < (latticeSize / 2) || i == latticeSize - j - 1 || i == j - 1 || i == latticeSize - j || i == latticeSize - j - 2 || i == latticeSize - j + 2 || i == latticeSize - j + 1 || i == latticeSize - j + 3 || i == latticeSize - j - 3) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeDiagonal() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (i == j || i == j - 1 || i == j + 1) {
                } else {
                    spins[i][j] = -1;
                }
            }
            spins[i][j] = 1;
        }
    }

    function MakeCircle() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if (Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize)) ** 2) < latticeSize / 2) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    function MakeDonut() {
        for (var i = 0; i < latticeSize; i++) {
            for (var j = 0; j < latticeSize; j++) {
                if ((Math.sqrt((latticeSize / 2 - (j * 3 - latticeSize)) ** 2 + (latticeSize / 2 - (i * 3 - latticeSize)) ** 2) < latticeSize / 2) && (Math.sqrt((latticeSize / 2 - (j * 6 - latticeSize * 2.5)) ** 2 + (latticeSize / 2 - (i * 6 - latticeSize * 2.5)) ** 2) > latticeSize / 2)) {
                    spins[i][j] = 1;
                } else {
                    spins[i][j] = -1;
                }
            }
        }
    }

    set({ spins })

    for (let i = 0; i < latticeSize; i++) {
        for (let j = 0; j < latticeSize; j++) {
            if (currentUrl === "/models/blume-capel") {
                colorBEG(i, j, spins)
            } else {
                color(i, j)
            }
        }
    }
}
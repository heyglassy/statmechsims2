import Store2 from "../../stores/store2";

const { settings, simulation } = Store2.getState()

const initSpins = () => {
    let BfieldM = new Array(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
        BfieldM[i] = new Array(settings.latticeSize);
        for (let j = 0; j < settings.latticeSize; j++) {
            BfieldM[i][j] = 0;
        }
    }

    let clusterChild = new Array<any>(
        settings.latticeSize * settings.latticeSize
    );
    let sBefore = new Array<any>(
        settings.latticeSize * settings.latticeSize
    );
    sBefore.fill(0);

    let spin = new Array<any>(
        settings.latticeSize * settings.latticeSize
    );

    for (
        let i = 0;
        i < settings.latticeSize * settings.latticeSize;
        i++
    ) {
        spin[i] = Math.random() < 0.5 ? 1 : -1;
    }

    let s = new Array<Array<number>>(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
        s[i] = new Array<number>(settings.latticeSize);
        for (let j = 0; j < settings.latticeSize; j++) {
            if (Math.random() < 0.5) s[i][j] = 1;
            else s[i][j] = -1;
        }
    }

    simulation.set({ localMagnetic: BfieldM, spin: spin, spins: s, spinBefore: sBefore, clusteredChildren: clusterChild })
}

export default initSpins
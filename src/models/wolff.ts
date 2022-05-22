import Store from "../stores/store";

const wolff = () => {
  const { latticeSize } = Store.getState().settings;
  const { temperature } = Store.getState().simulation;
  const { context, secondaryColor, primaryColor } = Store.getState().canvas;

  let { spinBefore, spin, clusteredChildren } = Store.getState().simulation;

  let sizeSquaredW = latticeSize * latticeSize;
  let width = 600 / latticeSize;

  function draw() {
    context!.fillStyle = secondaryColor;
    for (let i = 0; i < latticeSize; ++i) {
      for (let j = 0; j < latticeSize; ++j) {
        const idx = i * latticeSize + j;
        if (spin[idx] == 1 && spinBefore[idx] != 1) {
          context!.fillStyle = secondaryColor;
          context!.fillRect(j * width, i * width, width, width);
        }
        if (spin[idx] == -1 && spinBefore[idx] != -1) {
          context!.fillStyle = primaryColor;
          context!.fillRect(j * width, i * width, width, width);
        }
      }
    }
  }

  const model = () => {
    let prob = 1.0 - Math.exp(-2.0 / temperature);
    let InnerLoopCountLocal = 0;

    makeCluster(prob);
    while (InnerLoopCountLocal < sizeSquaredW / width) {
      let updateCluster = clusteredChildren[randomInt(0, sizeSquaredW)];
      for (let i = 0; i < sizeSquaredW; ++i) {
        if (clusteredChildren[i] == updateCluster) {
          spin[i] = -spin[i];
          InnerLoopCountLocal++;
        }
      }
    }

    function parentOf(child: any) {
      let parent = clusteredChildren[child];
      while (child != parent) {
        child = parent;
        parent = clusteredChildren[child];
      }
      return child;
    }

    function connect(i: any, j: any) {
      let ri = parentOf(i);
      let rj = parentOf(j);
      let root = ri < rj ? ri : rj;
      let child = i;
      while (child != root) {
        let parent = clusteredChildren[child];
        clusteredChildren[child] = root;
        child = parent;
      }
      child = j;
      while (child != root) {
        let parent = clusteredChildren[child];
        clusteredChildren[child] = root;
        child = parent;
      }
    }

    function makeCluster(prob: any) {
      for (let i = 0; i < sizeSquaredW; ++i) clusteredChildren[i] = i;
      for (let i = 0; i < sizeSquaredW; ++i) {
        // horizontal bonds
        let j = (i + 1) % sizeSquaredW;
        if (spin[i] == spin[j] && Math.random() < prob) connect(i, j);
      }
      for (let i = 0; i < sizeSquaredW; ++i) {
        // vartical bonds
        let j = (i + latticeSize) % sizeSquaredW;
        if (spin[i] == spin[j] && Math.random() < prob) connect(i, j);
      }
      for (let i = 0; i < sizeSquaredW; ++i) {
        clusteredChildren[i] = parentOf(i);
      }
    }

    function randomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    // }))
  };

  model();
  draw();
};

export default wolff;

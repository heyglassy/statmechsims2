// import { colorStore, Store } from "../stores/store";
import Store2 from "../stores/store";

const transverse = () => {
  // let { settings, context, setDashboard, dashboard, incSteps } =
  //   create(Store).getState();

  // const { primaryColor, secondaryColor } = create(colorStore).getState();

  //TODO: Disable canvas painting.
  // const { context, primaryColor, secondaryColor } = Canvas.getState();
  // const settings = Settings.getState()

  const { magneticField } = Store2.getState().settings;
  const { temperature } = Store2.getState().simulation
  const { context, secondaryColor, primaryColor } = Store2.getState().canvas

  let l = 125;
  let w = 600 / l - 1;
  let y = 600;

  let n_spin = 125;
  let temp = temperature!;
  let gamma = magneticField!;

  let spin = new Array(n_spin);
  let wall = new Array(n_spin);

  for (let i = 0; i < n_spin; ++i) {
    spin[i] = Math.random() < 0.5 ? 1 : -1;
    wall[i] = init_wall();
  }

  function exp_dist(theta: any) {
    if (theta > 0.0) {
      return Math.abs(Math.log(1.0 - Math.random()) * theta);
    } else {
      return Number.MAX_VALUE;
    }
  }

  function make_wall() {
    let theta = temp / gamma;
    let pos = exp_dist(theta);
    let width;
    let wall = new Array();
    while (pos < 1.0) {
      width = exp_dist(theta);
      wall.push(pos);
      pos += width;
    }
    return wall;
  }

  function init_wall() {
    let wall = make_wall();
    if (wall.length % 2 > 0) wall.pop();
    wall.push(1.0);
    return wall;
  }

  function create_cluster(idx: any) {
    let w0 = wall[idx];
    let w1 = make_wall();
    w1.push(1.0);

    let x0, x1;
    let x = 0.0;
    let i0 = 0;
    let i1 = 0;
    let w = new Array();
    while (x < 1.0) {
      x0 = w0[i0];
      x1 = w1[i1];
      if (x0 < x1) {
        x = x0;
        i0 += 1;
      } else {
        x = x1;
        i1 += 1;
      }
      w.push(x);
    }
    let spin = new Array(w.length);
    let ene = new Array(w.length);
    for (let i = 0; i < ene.length; ++i) ene[i] = 0.0;

    return {
      num: w.length,
      wall: w,
      spin: spin,
      ene: ene,
    };
  }

  function add_ene(cluster: any, idx: any) {
    let w1 = wall[idx];
    let i1 = 0;
    let x1 = w1[i1++];
    let s1 = spin[idx];

    let bottom = 0.0,
      top = 0.0;
    for (let i = 0; i < cluster.num; ++i) {
      top = cluster.wall[i];

      while (x1 < top) {
        cluster.ene[i] += s1 * (x1 - bottom);
        bottom = x1;
        x1 = w1[i1++];
        s1 *= -1;
      }
      cluster.ene[i] += s1 * (top - bottom);
      bottom = top;
    }
  }

  function prob(e: any) {
    return 1.0 / (1.0 + Math.exp((-2.0 * e) / temp));
  }

  function flip_cluster(cluster: any) {
    let p;
    if (cluster.num == 1) {
      p = prob(cluster.ene[0]);
    } else {
      p = prob(cluster.ene[0] + cluster.ene[cluster.num - 1]);
    }
    cluster.spin[0] = Math.random() < p ? +1 : -1;
    cluster.spin[cluster.num - 1] = cluster.spin[0];

    for (let i = 1; i < cluster.num - 1; ++i) {
      p = prob(cluster.ene[i]);
      cluster.spin[i] = Math.random() < p ? +1 : -1;
    }
  }

  function update_spin(idx: any) {
    let cluster = create_cluster(idx);
    add_ene(cluster, (idx + 1) % n_spin);
    add_ene(cluster, (idx - 1 + n_spin) % n_spin);
    flip_cluster(cluster);

    spin[idx] = cluster.spin[0];
    wall[idx] = new Array();
    for (let i = 0; i < cluster.num - 1; ++i) {
      if (cluster.spin[i] != cluster.spin[i + 1]) {
        wall[idx].push(cluster.wall[i]);
      }
    }
    wall[idx].push(1.0);
  }

  function update() {
    for (let i = 0; i < n_spin; ++i) {
      let idx = Math.floor(Math.random() * n_spin);
      update_spin(idx);
    }
  }
  function draw() {
    let y0, y1;
    for (let i = 0; i < l; ++i) {
      context!.fillStyle = spin[i] > 0 ? secondaryColor : primaryColor;
      context!.fillRect(i * (w + 1), 0, w, y);
      context!.fillStyle = spin[i] > 0 ? primaryColor : secondaryColor;
      for (let j = 0; j < wall[i].length; j += 2) {
        y0 = wall[i][j] * y;
        y1 = wall[i][j + 1] * y;
        context!.fillRect(i * (w + 1), y0, w, y1 - y0);
      }
    }
  }
  update();
  draw();

  // if (settings.freePlay || settings.simulation) {
  //   if (settings.simulation) {
  //     temperatureInc();

  //     incSteps();
  //     setTimeout(() => {
  //       window.requestAnimationFrame(transverse);
  //     }, 60);
  //   }

  //   if (settings.freePlay) {
  //     setDashboard({
  //       ...dashboard,
  //       temperature: settings.initialTemp!,
  //     });
  //     setTimeout(() => {
  //       window.requestAnimationFrame(transverse);
  //     }, 60);
  //   }
  // }
};

export default transverse;

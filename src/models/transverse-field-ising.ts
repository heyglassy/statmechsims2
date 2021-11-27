import create from "zustand";
import TSStore from "../types/ts_store";

const transverse = (timestamp: number) => {
  let {
    settings,
    context,
    setDashboard,
    dashboard,
    canvas,
    updatePayload,
    incCycles,
    incSteps,
    incFrames,
    endSimulation,
  } = create(TSStore).getState();

  var l = 125;
  var w = 600 / l - 1;
  var y = 600;

  var n_spin = 125;
  var temp = settings.initialTemp!;
  var gamma = settings.magneticField!;

  var spin = new Array(n_spin);
  var wall = new Array(n_spin);

  for (var i = 0; i < n_spin; ++i) {
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
    var theta = temp / gamma;
    var pos = exp_dist(theta);
    var width;
    var wall = new Array();
    while (pos < 1.0) {
      width = exp_dist(theta);
      wall.push(pos);
      pos += width;
    }
    return wall;
  }

  function init_wall() {
    var wall = make_wall();
    if (wall.length % 2 > 0) wall.pop();
    wall.push(1.0);
    return wall;
  }

  function create_cluster(idx: any) {
    var w0 = wall[idx];
    var w1 = make_wall();
    w1.push(1.0);

    var x0, x1;
    var x = 0.0;
    var i0 = 0;
    var i1 = 0;
    var w = new Array();
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
    var spin = new Array(w.length);
    var ene = new Array(w.length);
    for (var i = 0; i < ene.length; ++i) ene[i] = 0.0;

    return {
      num: w.length,
      wall: w,
      spin: spin,
      ene: ene,
    };
  }

  function add_ene(cluster: any, idx: any) {
    var w1 = wall[idx];
    var i1 = 0;
    var x1 = w1[i1++];
    var s1 = spin[idx];

    var bottom = 0.0,
      top = 0.0;
    for (i = 0; i < cluster.num; ++i) {
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
    var p;
    if (cluster.num == 1) {
      p = prob(cluster.ene[0]);
    } else {
      p = prob(cluster.ene[0] + cluster.ene[cluster.num - 1]);
    }
    cluster.spin[0] = Math.random() < p ? +1 : -1;
    cluster.spin[cluster.num - 1] = cluster.spin[0];

    for (i = 1; i < cluster.num - 1; ++i) {
      p = prob(cluster.ene[i]);
      cluster.spin[i] = Math.random() < p ? +1 : -1;
    }
  }

  function update_spin(idx: any) {
    var cluster = create_cluster(idx);
    add_ene(cluster, (idx + 1) % n_spin);
    add_ene(cluster, (idx - 1 + n_spin) % n_spin);
    flip_cluster(cluster);

    spin[idx] = cluster.spin[0];
    wall[idx] = new Array();
    for (i = 0; i < cluster.num - 1; ++i) {
      if (cluster.spin[i] != cluster.spin[i + 1]) {
        wall[idx].push(cluster.wall[i]);
      }
    }
    wall[idx].push(1.0);
  }

  function update() {
    for (var i = 0; i < n_spin; ++i) {
      var idx = Math.floor(Math.random() * n_spin);
      update_spin(idx);
    }
  }
  function draw() {
    var color = ["#FFD700", "#00008B"];
    let y0, y1;
    for (var i = 0; i < l; ++i) {
      context!.fillStyle = spin[i] > 0 ? color[0] : color[1];
      context!.fillRect(i * (w + 1), 0, w, y);
      context!.fillStyle = spin[i] > 0 ? color[1] : color[0];
      for (var j = 0; j < wall[i].length; j += 2) {
        y0 = wall[i][j] * y;
        y1 = wall[i][j + 1] * y;
        context!.fillRect(i * (w + 1), y0, w, y1 - y0);
      }
    }
  }
  update();
  draw();
  if (settings.freePlay || settings.simulation) {
    if (settings.simulation) {
      if (
        dashboard.steps % settings.stepsPerFrame! == 0 &&
        dashboard.steps != 0
      ) {
        // this code updaetes the dashboard and resets values to continue the experiment
        let frame = canvas!.toDataURL();
        updatePayload({ settings: settings, data: dashboard, frames: frame });
        incFrames(); // This increments the temperature as well.
        if (dashboard.temperature == settings.maxTemp!) {
          if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
            endSimulation();
          } else {
            incCycles(); // This also resets temperature to start the next cycle.
          }
        }
      }
      incSteps();
      setTimeout(() => {
        window.requestAnimationFrame(transverse);
      }, 60);
    }
    if (settings.freePlay) {
      setDashboard({
        temperature: settings.initialTemp!,
      });
      setTimeout(() => {
        window.requestAnimationFrame(transverse);
      }, 60);
    }
  }
};

export default transverse;

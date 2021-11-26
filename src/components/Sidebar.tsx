import Store from "../types/store";
import { Switch } from "@headlessui/react";
import runner from "../models/runner";
import { metropolisSetup } from "../models/setup";

const Sidebar = () => {
  let {
    settings,
    setSettings,
    initDashboard,
    initSpins,
    updateGraph,
    graph,
    graphData,
  } = Store((state) => state);

  return (
    <nav className="flex flex-col h-screen w-80">
      <div className="h-3/4 left-0 bg-gray-200 overflow-y-scroll overscroll-y-auto p-3">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="flex items-center my-1">
          <h2 className="text-sm mr-3 text-black text-opacity-50">
            Set Freeplay Mode:
          </h2>
          <Switch
            checked={settings.freePlay}
            onChange={() => {
              setSettings({
                ...settings,
                freePlay: !settings.freePlay,
                simulation: false,
              });
              initDashboard();
              runner();
            }}
            className={`${
              settings.freePlay ? "bg-green-400" : "bg-gray-500"
            } relative inline-flex items-center h-6 rounded-full w-11`}
          >
            <span className="sr-only">Set Freeplay</span>
            <span
              className={`${
                settings.freePlay ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 transform bg-white rounded-full`}
            ></span>
          </Switch>
        </div>
        <div className="bg-black my-2 w-full h-px"></div>
        <div>
          <h1>Intitial Temperature</h1>
          <input
            type="range"
            name="temp"
            value={settings.initialTemp}
            min="0"
            max="5"
            step="0.01"
            onChange={(e) =>
              setSettings({ ...settings, initialTemp: Number(e.target.value) })
            }
          />
          <input
            min="0"
            max="5"
            step="0.01"
            type="number"
            name="temp"
            value={settings.initialTemp}
            onChange={(e) =>
              setSettings({
                ...settings,
                initialTemp: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        {/* <div>
          <h1>Min Temperature</h1>
          <input
            type="range"
            name="temp"
            min="0"
            max="5"
            step="0.1"
            value={settings.minTemp}
            onChange={(e) =>
              setSettings({ ...settings, minTemp: Number(e.target.value) })
            }
          />
          <input
            type="number"
            name="temp"
            min="0"
            max="5"
            value={settings.minTemp}
            step="0.1"
            onChange={(e) =>
              setSettings({
                ...settings,
                minTemp: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div> */}
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Max Temperature</h1>
          <input
            type="range"
            name="temp"
            min="0"
            max="5"
            value={settings.maxTemp}
            onChange={(e) =>
              setSettings({ ...settings, maxTemp: Number(e.target.value) })
            }
          />
          <input
            type="number"
            name="temp"
            min="0"
            max="5"
            value={settings.maxTemp}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxTemp: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="inline-flex">
          <h1>Temperature Step</h1>
          <select
            onChange={(e) =>
              setSettings({ ...settings, tempStep: Number(e.target.value) })
            }
          >
            <option>1</option>
            <option>0.1</option>
            <option selected>0.01</option>
            <option>0.001</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        {/* TODO: Depricate Fixed Temperature */}
        {/* <div className="inline-flex items-center">
          <h1>Fixed Temperature</h1>
          <input
            className="ml-5 w-4 h-4 bg-gray-100 border border-black rounded"
            type="checkbox"
            checked={settings.fixedTemp}
            onChange={(e) =>
              setSettings({ ...settings, fixedTemp: e.target.checked })
            }
            name="temp"
          />
        </div> */}
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Equilibriation Delay(ms)</h1>
          <input
            type="range"
            name="temp"
            min="0"
            max="1000"
            value={settings.equilibriationDelay}
            onChange={(e) =>
              setSettings({
                ...settings,
                equilibriationDelay: Number(e.target.value),
              })
            }
          />
          <input
            value={settings.equilibriationDelay}
            onChange={(e) =>
              setSettings({
                ...settings,
                equilibriationDelay: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            type="number"
            name="temp"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="inline-flex">
          <h1>Number of cycles</h1>
          <input
            value={settings.numberOfCycles}
            onChange={(e) =>
              setSettings({
                ...settings,
                numberOfCycles: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            type="number"
            name="temp"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex">
          <h1>Lattice Size</h1>
          <select
            onChange={(e) =>
              setSettings({ ...settings, latticeSize: Number(e.target.value) })
            }
          >
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>8</option>
            <option>10</option>
            <option>25</option>
            <option>40</option>
            <option>50</option>
            <option>75</option>
            <option selected>100</option>
            <option>200</option>
            <option>300</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex">
          <h1>Steps Per Frame</h1>
          <select
            onChange={(e) =>
              setSettings({
                ...settings,
                stepsPerFrame: Number(e.target.value),
              })
            }
          >
            <option>10</option>
            <option>100</option>
            <option>1000</option>
            <option>10000</option>
            <option>100000</option>
            <option>1000000</option>
            <option>10000000</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex">
          <h1>Mole Ratio</h1>
          <select
            onChange={(e) => {
              setSettings({
                ...settings,
                moleRatio: {
                  up: Number(e.target.value),
                  down: 1 - Number(e.target.value),
                },
              });
            }}
          >
            <option value="0">0.0 Up and 1.0 Down</option>
            <option value=".25">0.25 Up and 0.75 Down</option>
            <option value=".5" selected>
              0.50 Up and 0.50 Down
            </option>
            <option value=".75">0.75 Up and 0.25 Down</option>
            <option value="1">1.0 Up and 0.0 Down</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Magnetic Field</h1>
          <input
            type="range"
            name="temp"
            value={settings.magneticField}
            min="0"
            max="20"
            onChange={(e) =>
              setSettings({
                ...settings,
                magneticField: Number(e.target.value),
              })
            }
          />
          <input
            min="0"
            max="20"
            type="number"
            name="temp"
            value={settings.magneticField}
            onChange={(e) =>
              setSettings({
                ...settings,
                magneticField: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Local Magnetic Field</h1>
          <input
            type="range"
            name="temp"
            value={settings.localMagneticField}
            min="0"
            max="10"
            onChange={(e) =>
              setSettings({
                ...settings,
                localMagneticField: Number(e.target.value),
              })
            }
          />
          <input
            min="0"
            max="10"
            type="number"
            name="temp"
            value={settings.localMagneticField}
            onChange={(e) =>
              setSettings({
                ...settings,
                localMagneticField: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Magnetism</h1>
          <select>
            <option>Ferromagnetic</option>
            <option>Anti-Ferromagnetic</option>
            <option>Biparite</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Boundaries Conditions</h1>
          <select
            className="w-48"
            onChange={(e) => {
              setSettings({
                ...settings,
                boundariesConditions: e.target.value,
              });
            }}
          >
            <option selected>Periodic Boundaries</option>
            <option>Anti-periodic Boundaries (both directions)</option>
            <option>Anti-periodic Boundaries (one direction)</option>
            <option>Isolated Boundaries</option>
            <option>Plus-Minus Boundaries (one direction)</option>
            <option>Skewed Plus Minus Boundaries</option>
            <option>Plus Boundaries (both directions)</option>
            <option>Minus Boundaries (both directions)</option>
            <option>Screw Periodic Boundaries</option>
            <option> Zero At Boundary</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Geometic Pattern</h1>
          <select
            onChange={(e) => {
              setSettings({
                ...settings,
                geometicPattern: e.target.value,
              });
            }}
          >
            <option selected>Random</option>
            <option>Align</option>
            <option>Cross</option>
            <option>Thick X</option>
            <option>Thin X</option>
            <option>Horizontal</option>
            <option>Vertical</option>
            <option>Diagonal</option>
            <option>SquareDrop</option>
            <option>Circular Droplet</option>
            <option>3 Connected Beads</option>
            <option>5 Bead Network</option>
            <option>Annulus (Donut)</option>
            <option>Grating</option>
            <option>Dots</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Nanotube Simulation</h1>
          <div className="flex items-center justify-between">
            <div>
              <h1>Width</h1>
              <input
                className="w-14 px-2 appearance-none border border-solid border-black rounded"
                type="number"
                value={settings.nanotubeSimulation.width}
                min="0"
                max={settings.latticeSize}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    nanotubeSimulation: {
                      ...settings.nanotubeSimulation,
                      width: Number(e.target.value),
                    },
                  });
                }}
              />
            </div>
            <div>
              <h1>Diameter</h1>
              <input
                className="w-14 px-2 appearance-none border border-solid border-black rounded"
                type="number"
                value={settings.nanotubeSimulation.diameter}
                min="0"
                max={settings.latticeSize}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    nanotubeSimulation: {
                      ...settings.nanotubeSimulation,
                      diameter: Number(e.target.value),
                    },
                  });
                }}
              />
            </div>
            <div>
              <h1>Height</h1>
              <input
                className="w-14 px-2 appearance-none border border-solid border-black rounded"
                type="number"
                value={settings.nanotubeSimulation.height}
                min="0"
                max={settings.latticeSize}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    nanotubeSimulation: {
                      ...settings.nanotubeSimulation,
                      height: Number(e.target.value),
                    },
                  });
                }}
              />
            </div>
            <div>
              <h1>Spin</h1>
              <select
                className="border border-black rounded"
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    nanotubeSimulation: {
                      ...settings.nanotubeSimulation,
                      spin: Number(e.target.value) == 1 ? true : false,
                    },
                  });
                }}
              >
                <option value={1}>Positive</option>
                <option value={0}>Negative</option>
              </select>
            </div>
          </div>
          <input
            className="bg-white rounded border-black border my-1 w-full h-8"
            type="button"
            value="Create Nanotube"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex items-center">
          <h1>Show Fixed Spin</h1>
          <input
            className="ml-5 bg-gray-100 border border-black rounded"
            type="checkbox"
            name="temp"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex">
          <h1>Proportion +1 Spin</h1>
          <input
            min="0"
            step="0.1"
            type="number"
            value={settings.proportionSpin.positive}
            onChange={(e) =>
              setSettings({
                ...settings,
                proportionSpin: {
                  ...settings.proportionSpin,
                  positive: Number(e.target.value),
                },
              })
            }
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex">
          <h1>Proportion -1 Spin</h1>
          <input
            min="0"
            step="0.1"
            type="number"
            value={settings.proportionSpin.negative}
            onChange={(e) =>
              setSettings({
                ...settings,
                proportionSpin: {
                  ...settings.proportionSpin,
                  negative: Number(e.target.value),
                },
              })
            }
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Randomize Configuration</h1>
          <div className="flex flex-row justify-evenly">
            <input
              className="border rounded border-solid border-black h-8 w-24"
              type="button"
              value="Align Spins"
            />
            <input
              className="border border-solid rounded border-black h-8 w-24"
              type="button"
              value="Randomize"
              onClick={() => {
                initSpins();
                metropolisSetup();
              }}
            />
          </div>
        </div>
        <div className="mb-5 w-full h-px"></div>
      </div>
      <div className="sticky text-center h-32 p-7 bg-white text-white">
        <input
          type="button"
          value={
            settings.simulation
              ? "Stop Simulation"
              : settings.freePlay
              ? "Turn Freeplay Mode off to run simulations"
              : "Run Simulation"
          }
          onClick={() => {
            setSettings({ ...settings, simulation: !settings.simulation });
            console.log(settings.simulation);
            if (!settings.simulation) {
              initDashboard();
              graph.clear();
            } // console.log(settings.stepsPerFrame!);
            runner();
          }}
          disabled={settings.freePlay ? true : false}
          className={`${
            settings.simulation
              ? "bg-red-500 text-xl"
              : settings.freePlay
              ? "bg-gray-500 text-xs"
              : "bg-green-500 text-xl"
          } h-20 w-64 rounded`}
        />
      </div>
    </nav>
  );
};
export default Sidebar;

const Sidebar = () => {
  return (
    <nav className="flex flex-col h-screen w-80">
      <div className="h-3/4 left-0 bg-gray-200 overflow-y-scroll overscroll-y-auto p-3">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="bg-black my-2 w-full h-px"></div>
        <div>
          <h1>Intitial Temperature</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Min Temperature</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Max Temperature</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="inline-flex">
          <h1>Temperature Step</h1>
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="inline-flex items-center">
          <h1>Fixed Temperature</h1>
          <input
            className="ml-5 bg-gray-100 border border-black rounded"
            type="checkbox"
            name="temp"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Equilibriation Delay(ms)</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="inline-flex">
          <h1>Number of cycles</h1>
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div className="flex">
          <h1>Lattice Size</h1>
          <select>
            <option>1000</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Steps Per Frame</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Mole Ratio</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Magnetic Field</h1>
          <input type="range" name="temp" />
          <input
            type="number"
            name="temp"
            value="1"
            step="0.1"
            className="px-3 py-1 w-20 h-6 bg-gray-100 border border-black rounded"
          />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Local Magnetic Field</h1>
          <input type="range" name="temp" />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Magnetism</h1>
          <select>
            <option>Ferromagnetic</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Boundaries Conditions</h1>
          <select>
            <option>Ferromagnetic</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Geometic Pattern</h1>
          <select>
            <option>Ferromagnetic</option>
          </select>
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Local Magnetic Field</h1>
          <input type="range" name="temp" />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Local Magnetic Field</h1>
          <input type="range" name="temp" />
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
                value="6"
              />
            </div>
            <div>
              <h1>Diameter</h1>
              <input
                className="w-14 px-2 appearance-none border border-solid border-black rounded"
                type="number"
                value="6"
              />
            </div>
            <div>
              <h1>Height</h1>
              <input
                className="w-14 px-2 appearance-none border border-solid border-black rounded"
                type="number"
                value="6"
              />
            </div>
            <div>
              <h1>Spin</h1>
              <select className="border border-black rounded">
                <option>Positive</option>
                <option>Negative</option>
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
        <div>
          <h1>Proportion +1 Spin</h1>
          <input type="range" name="temp" />
        </div>
        <div className="bg-white my-2 w-full h-px"></div>
        <div>
          <h1>Proportion -1 Spin</h1>
          <input type="range" name="temp" />
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
            />
          </div>
        </div>
        <div className="mb-5 w-full h-px"></div>
      </div>
      <div className="sticky text-center h-12 p-7 bg-white text-white">
        <input
          type="button"
          value="Start Simulation"
          className="bg-green-500 h-16 w-64 rounded"
        />
      </div>
    </nav>
  );
};
export default Sidebar;

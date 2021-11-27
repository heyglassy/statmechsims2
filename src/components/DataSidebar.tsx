import useStore from "../types/store";

const DataSidebar = () => {
  const { dashboard, initDashboard } = useStore();
  return (
    <div className="flex flex-wrap m-3 items-center w-5/6">
      <h1 className="text-2xl font-bold">Data</h1>
      <div className="bg-black my-1 w-full h-px"></div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Saved Frames</h1>
        <h1>
          {dashboard.frames.savedFrames}/{dashboard.frames.totalFrames}
        </h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Temperature</h1>
        <h1>{dashboard.temperature}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Cycle</h1>
        <h1>
          {dashboard.cycles.currentCycle}/{dashboard.cycles.totalCycles}
        </h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Steps</h1>
        <h1>{dashboard.steps}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Energy</h1>
        <h1>{dashboard.energy}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Average Energy</h1>
        <h1>{Math.round(dashboard.averageEnergy * 10000) / 10000}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Sigma Energy</h1>
        <h1>{Math.round(dashboard.sigmaEnergy * 10000) / 10000}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Magnetization</h1>
        <h1>{dashboard.magnetization}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Average Magnetization</h1>
        <h1>{Math.round(dashboard.averageMagnetization * 10000) / 10000}</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Sigma Magnetism</h1>
        <h1>{Math.round(dashboard.sigmaMagnetisation * 10000) / 10000}</h1>
      </div>
      <input
        type="button"
        value="Reset Stats"
        className="text-white bg-blue-500 h-10 w-24 rounded"
        onClick={initDashboard}
      />
    </div>
  );
};

export default DataSidebar;

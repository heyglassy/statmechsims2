const DataSidebar = () => {
  return (
    <div className="flex flex-wrap m-3 items-center">
      <h1 className="text-2xl font-bold">Data</h1>
      <div className="bg-black my-1 w-full h-px"></div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Saved Frames</h1>
        <h1>--/--</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Temperature</h1>
        <h1>0.00</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Cycle</h1>
        <h1>--/--</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Steps</h1>
        <h1>10000</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Energy</h1>
        <h1>-3.213</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Average Energy</h1>
        <h1>0.000</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Sigma Energy</h1>
        <h1>0.000</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Magnetization</h1>
        <h1>0.000</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Average Magnetization</h1>
        <h1>0.000</h1>
      </div>
      <div className="w-24 h-16 p-2 text-center text-xs bg-white rounded m-2">
        <h1>Sigma Magnetism</h1>
        <h1>0.000</h1>
      </div>
      <input
        type="button"
        value="Reset Stats"
        className="text-white bg-blue-500 h-10 w-24"
      />
    </div>
  );
};

export default DataSidebar;

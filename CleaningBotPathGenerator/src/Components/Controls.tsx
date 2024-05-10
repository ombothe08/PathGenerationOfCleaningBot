interface Props {
  onStartSketching: () => void;
  onPlaceChargingPoint: () => void;
  onStartCleaning: () => void;
  onStopCleaning: () => void;
  isSketching: boolean; // Add isSketching prop
  onStopSketching: () => void; // Add onStopSketching prop
}
 
const Controls: React.FC<Props> = ({ onStartSketching, onPlaceChargingPoint, onStartCleaning, onStopCleaning,onStopSketching }) => {
 
  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white px-6 py-4 flex justify-between items-center fixed w-full top-0 left-0 shadow-md">
        {/* Left section */}
        <div className="flex flex-col items-center w-1/2">
          <div className="flex justify-center w-full">
            <h1 className="text-lg font-semibold">Sketching Part</h1>
          </div>
          <div className="flex justify-center w-full mt-4">
            <button  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" onClick={onStartSketching}>Start Sketching</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" onClick={onPlaceChargingPoint}>Charging Point</button>
            <button  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" onClick={onStopSketching}>Finish Sketch</button>
          </div>
        </div>
 
        {/* Right section */}
        <div className="flex flex-col items-center w-1/2 justify-end">
          <div className="flex justify-center w-full">
            <h1 className="text-lg font-semibold">Simulation Part</h1>
          </div>
          <div className="flex justify-center w-full mt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" onClick={onStartCleaning}>Start Cleaning</button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" onClick={onStopCleaning}>Stop Cleaning</button>
          </div>
        </div>
    </div>
  );
};
 
export default Controls;
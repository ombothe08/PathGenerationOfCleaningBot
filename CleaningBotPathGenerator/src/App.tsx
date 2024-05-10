import React, { useState } from "react";
import CanvasContainer from "./Components/CanvasContainer";
import Controls from "./Components/Controls";
 
const App: React.FC = () => {
  const [isSketching, setIsSketching] = useState(false);
 
  const handleStartSketching = () => {
    setIsSketching(false);
  };
 
  const handleStopSketching = () => {
    setIsSketching(false);
  };
 
  const handlePlaceChargingPoint = () => {
    // Implement the charging point placement logic here
  };
 
  const handleStartCleaning = () => {
    // Implement the start cleaning logic here
  };
 
  const handleStopCleaning = () => {
    // Implement the stop cleaning logic here
  };
 
  return (
    <div className="App">
      <div className="main-container">
        <div className="control-container">
          <Controls
            onStartSketching={handleStartSketching}
            onPlaceChargingPoint={handlePlaceChargingPoint}
            onStartCleaning={handleStartCleaning}
            onStopCleaning={handleStopCleaning}
            isSketching={isSketching}
            onStopSketching={handleStopSketching}
          />
        </div>
        <div className="canvas-container">
          <CanvasContainer isSketching={isSketching} />
        </div>
      </div>
    </div>
  );
};
 
export default App;
 
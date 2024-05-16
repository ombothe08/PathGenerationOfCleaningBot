import React, { useState } from "react";
import Controls from "./components/Controls";
import ThreeJSDrawingWindow from "./components/ThreeJSDrawingWindow";

const App: React.FC = () => {
  const [isSketching, setIsSketching] = useState(false);

  const handleStartSketching = () => {
    setIsSketching(false);
  };

  const handleStopSketching = () => {
    setIsSketching(false);
  };

  const handlePlaceChargingPoint = () => {
    setIsSketching(false);
  };

  const handleStartCleaning = () => {};

  const handleStopCleaning = () => {};

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
          <ThreeJSDrawingWindow isSketching={isSketching} />
        </div>
      </div>
    </div>
  );
};

export default App;

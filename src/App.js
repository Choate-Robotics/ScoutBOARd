import logo from "./logo.svg";
import "./App.css";
// import papa from "papaparse";
import { SDContext, SDRContext } from "./library/scoutingData";
import { useState, useContext } from "react";
 import { SDProvider, SDRProvider, IKProvider } from "./library/scoutingData";
import {TitleScreen, Person, Robots} from "./components/general";
import compileData from "./library/dataCompiler";
import {ScoutPage} from "./components/scoutPage";
import { Colors } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
ChartJS.register(Colors)
function SiteController() {
  let compiled = false
  const [scoutingDataRaw,] = useContext(SDRContext);
  const [scoutingData,] = useContext(SDContext);
  if (scoutingDataRaw.length == 0 && scoutingData.length == 0) {
    return <TitleScreen />;
  } else if (scoutingDataRaw.length > 0 && scoutingData.length == 0) {
    compiled = true;
    compileData();
  } else {
  return (
    <ScoutPage />
    );
  }
}

function App() {

  return (
    <SDProvider>
    <IKProvider>
    <SDRProvider>
      <SiteController />
    </SDRProvider>
    </IKProvider>
    </SDProvider>
  );
}

export default App;

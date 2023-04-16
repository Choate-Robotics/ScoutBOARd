import logo from "./logo.svg";
import "./App.css";
// import papa from "papaparse";
import { SDContext } from "./library/scoutingData";
import { useState, useContext } from "react";
 import { SDProvider } from "./library/scoutingData";
import {TitleScreen, Person, Robots} from "./components/general";
import {ScoutPage} from "./components/scoutPage";
function SiteController() {
  const [scoutingData,] = useContext(SDContext);
  if (scoutingData.length == 0) {
    return <TitleScreen />;
  } else {

  return (
    <ScoutPage />
    );
  }
}

function App() {

  return (
    <SDProvider>
      <SiteController />
    </SDProvider>
  );
}

export default App;

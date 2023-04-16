import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDRContext } from "../library/scoutingData";
import  compileData  from "../library/dataCompiler";
import RadarChart from "./charts/RadarChart";

export function TitleScreen() {
  const [ScoutingDataRaw, setScoutingDataRaw] = useContext(SDRContext);

  const uploadCSV = (event) => {
    const file = event.target.files[0];
    papa.parse(file, {
      header: true,
      skipEmptyRows: true,
      complete: function (results) {
        console.log("Parsed csv", results.data);
        setScoutingDataRaw(results.data);
      },
      error: function (error) {
        console.log("Error parsing csv", error);
      },
    });
  };

  return (
    <div className="Scout-Grapher">
      <header className="Scout-Grapher-header">
        <h3>Welcome to Scout Grapher!</h3>
        <p>
          This is a tool to help you visualize your scouting data for the First
          Robotics Competition.
        </p>
        <p>To get started, click the "Upload Data" button below.</p>
        <input type="file" id="file" accept=".csv" placeholder="Scouting Data" onChange={uploadCSV} />
      </header>
    </div>
  );
}

export function Person() {
  const data = {
    labels: ["Running", "Swimming", "Eating", "Cycling"],
    datasets: [
      {
        label: "James",
        data: [20, 10, 4, 2],
      },
    ],
  };

  return <RadarChart data={data} />;
}

export function Robots() {
  const [scoutingData] = useContext(SDContext);

  const keysToRemove = ["Team Num", "Match Num"];

  function filterData(data) {
    const filteredData = {};
    for (let key in data) {
      if (!keysToRemove.includes(key)) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  }

  let datasets = [];
  for (let i = 0; i < scoutingData.length; i++) {
    datasets[i] = {
      label: scoutingData[i]["Team Num"],
      data: Object.values(filterData(scoutingData[i])),
    };
  }
  console.log(datasets);
  const data = {
    labels: Object.keys(filterData(scoutingData[0])),
    datasets: datasets,
  };
  return <RadarChart data={data} />;
}

import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDRContext, PSContext } from "../library/scoutingData";
import  compileData  from "../library/dataCompiler";
import RadarChart from "./charts/RadarChart";

export function TitleScreen() {
  const [ScoutingDataRaw, setScoutingDataRaw] = useContext(SDRContext);
  const [PitScoutingData, setPitScoutingData] = useContext(PSContext);

  const uploadCSV = (e) => {
    e.preventDefault();

    const files = [
      document.getElementById("sdfile").files[0],
      document.getElementById("pitfile").files[0],
    ]
    papa.parse(files[0], {
      header: true,
      skipEmptyRows: true,
      complete: function (results) {
        console.log("Parsed Scouting Data csv", results.data);
        setScoutingDataRaw(results.data);
      },
      error: function (error) {
        console.log("Error parsing Scouting Data csv", error);
      },
    });

    papa.parse(files[1], {
      header: true,
      skipEmptyRows: true,
      complete: function (results) {
        console.log("Parsed Pit Scouting csv", results.data);
        setPitScoutingData(results.data);
      },
      error: function (error) {
        console.log("Error parsing Pit Scouting csv", error);
      },
    });
  };

  return (
    <div className="Scout-Grapher">
      <br />
      <div className="Scout-Grapher-title">
        <h3>Welcome to Scout Grapher!</h3>
        <p>
          This is a tool to help you visualize your scouting data for the First
          Robotics Competition.
        </p>
        <p>To get started, click the "Upload Data" button below.</p>
        <form onSubmit={uploadCSV}>
          <label for="pitfile">
            Pit Scouting
            <input type="file" id="pitfile" className={"custom-file-input"} accept=".csv" placeholder="Scouting Data" />
          </label>
          <br />
          <label for="sdfile">
            Scouting Data
            <input type="file" id="sdfile" className={"custom-file-input"} accept=".csv" placeholder="Pit Scouting" /> 
          </label>
          <input type="submit" value="Lets Get Started!" />
        </form>
      </div>
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

import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDContext } from "../library/scoutingData";
import {ChartTool, TrendGraph} from "./charts/ChartTool";
import WiredBoar from "../assets/WiredBoar.png";
import compileData from "../library/dataCompiler";
import BarChart from "./charts/BarChart";
function header() {
  return (
    <header>
      <div className="header-divisions">
        <div className="header-division-logo">
          <img src={WiredBoar} className="Logo" alt="Boar Logo" />
        </div>
        <div className="header-division-name">
          <h2>Scout Grapher</h2>
        </div>
        <div className="header-divisions-buttons">
          <button className="header-division-button">Teams</button>
          <button className="header-division-button">Graph</button>
          <button className="header-division-button">Compare</button>
          <button className="header-division-button">Pick Lists</button>
        </div>
      </div>
    </header>
  );
}

function TeamList({ onTeam }) {
  const [scoutingData] = useContext(SDContext);

  function average(arr, key) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseInt(arr[i][key]);
    }
    let ave = sum / arr.length;
    return ave.toFixed(2);
  }

  return (
    <div className="team-list">
      <table className="team-list-table">
        <thead>
          <th>Team</th>
          <th>Ave. Auto</th>
          <th>Ave. Tele</th>
          <th>Ave. End</th>
        </thead>
        {scoutingData.map((team, i) => (
            <tr key={i} team={team.team} onClick={onTeam}>
              <td>{team.team}</td>
              <td>{average(team.matches, "TotalAuto")}</td>
              <td>{average(team.matches, "TotalTele")}</td>
              <td>{average(team.matches, "Charging Station")}</td>
            </tr>
        ))}
      </table>
    </div>
  );
}

function AutoGraph({ team }) {
  const autos = [
    "AutoHighCones",
    "AutoMidCones",
    "AutoLowCones",
    "AutoHighCubes",
    "AutoMidCubes",
    "AutoLowCubes",
    "AutoHybrid",
  ];
  const total = ["TotalAuto"];
  return (
    <div className="charts-wrapper">
      <ChartTool team={team} labels={autos} chartType={"radar"} />
      <ChartTool team={team} labels={total} chartType={"bar"} />
    </div>
  );
}

function TeleGraph({ team }) {
  const tele = [
    "TeleHighCones",
    "TeleMidCones",
    "TeleLowCones",
    "TeleHighCubes",
    "TeleMidCubes",
    "TeleLowCubes",
    "TeleHybrid",
  ];
  const total = ["TotalTele"];
  return (
    <div className="charts-wrapper">
      <ChartTool team={team} labels={tele} chartType={"radar"} />
      <ChartTool team={team} labels={total} chartType={"bar"} />
    </div>
  );
}                  


function EndGraph({ team }) {
  const end = ["Charging Station"];
  const trend = ["TotalAuto", "TotalTele", "Charging Station"]
  return (
    <div className="charts-wrapper">
        <ChartTool team={team} labels={end} chartType={"bar"} />
        <h3>Match Trend:</h3>
        <TrendGraph team={team} label={"Match Num"} targets={trend}/>
    </div>
    );
}

function TeamPage() {
  const [scoutingData] = useContext(SDContext);
  let [team, setTeam] = useState(scoutingData[0].team);

  function onTeamSelect(e) {
    console.log(e.currentTarget)
    if (e.currentTarget.getAttribute("team") === null) {
      return;
    }
    setTeam(e.currentTarget.getAttribute("team"));
    console.log(e.currentTarget.getAttribute("team"));
  }

  return (
    <div className="team-page">
      <div className="team-page-list">
        <h2>Team Data: {team}</h2>
        <TeamList onTeam={onTeamSelect} />
      </div>
      <div className="team-page-graph">
        <div className="team-page-graph-auto">
          <h3>Auto</h3>
          <AutoGraph team={team} />
        </div>
        <div className="team-page-graph-tele">
          <h3>Tele</h3>
          <TeleGraph team={team} />
        </div>
        <div className="team-page-graph-end">
          <h3>End</h3>
          <EndGraph team={team} />
        </div>
      </div>
    </div>
  );
}

function body() {
  return (
    <div className="body">
      <TeamPage />
    </div>
  );
}

export function ScoutPage() {
  return (
    <div className="Scout-Grapher">
      {header()}
      {body()}
    </div>
  );
}

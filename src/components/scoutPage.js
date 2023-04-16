import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDContext } from "../library/scoutingData";
import {ChartTool, TrendGraph} from "./charts/ChartTool";
import WiredBoar from "../assets/WiredBoar.png";
import compileData from "../library/dataCompiler";
import BarChart from "./charts/BarChart";
import { useDrag, useDrop } from "react-dnd";


function Header({onButton}) {
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
          <button value={"Teams"} onClick={onButton} className="header-division-button">Teams</button>
          <button value={"Graph"} onClick={onButton} className="header-division-button">Graph</button>
          <button value={"Compare"} onClick={onButton} className="header-division-button">Compare</button>
          <button value={"Lists"} onClick={onButton} className="header-division-button">Pick Lists</button>
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
      <ChartTool team={team} labels={autos} chartType={"radar"}/>
      <ChartTool team={team} labels={total} chartType={"bar"}/>
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
      <ChartTool team={team} labels={tele} chartType={"radar"}/>
      <ChartTool team={team} labels={total} chartType={"bar"}/>
    </div>
  );
}                  


function EndGraph({ team }) {
  const end = ["Charging Station"];
  const trend = ["TotalAuto", "TotalTele", "Charging Station", "TotalPieces"]
  return (
    <div className="charts-wrapper">
        <ChartTool team={team} labels={end} chartType={"bar"} />
        <TrendGraph team={team} label={"Match Num"} targets={trend} title={"Total Trend"}/>
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
        <h2>Team: {team}</h2>
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

function PickListItem(){
    const [collected, drag, dragPreview] = useDrag({
        type: "pickListItem",
        item: {team: "Test"},
    })

    return collected.IsDragging? (
        <div ref={dragPreview} className="pick-list-item">
            <h3>Dragging</h3>
        </div>
    ) : (
        <div ref={drag} {...collected} className="pick-list-item">
            <h3>Test</h3>
        </div>
    )
}

function PickList() {

    const [collectedProps, drop] = useDrop({
        accept: "pickListItem",
        drop: (item, monitor) => {
            console.log(item)
        }
    })

    return (
        <div ref={drop} className="pick-list">
            Drop Target
        </div>
    )
}

function PickListPage() {
    return (
        <div className="pick-list-page">
            <div className="team-page-list">
                <h2>Team List</h2>
                <TeamList />
            </div>
            <div className="pick-list-page-lists">
                <div className="pick-list-page-list">
                    <h3>1st Pick List</h3>
                    <PickListItem />
                </div>
                <div className="pick-list-page-list">
                    <h3>2nd Pick List</h3>
                    <PickList />
                </div>
            </div>
        </div>
    )
}


function Body({current}) {
    switch (current) {
        case "Teams":
            return (
                <div className="body">
                <TeamPage />
                </div>
            );
        case "Graph":
            return (
                <div className="body">
                </div>
            )
        case "Compare":
            return (
                <div className="body">
                </div>
            )
        case "Lists":
            return (
                <div className="body">
                    <PickListPage />
                </div>
            )
        default:
            return (
                <div className="body">
                <TeamPage />
                </div>
            )
    }
}

export function ScoutPage() {
    const [page, setPage] = useState([]);

    function changePage(e) {
        setPage(e.currentTarget.value);
    }

  return (
    <div className="Scout-Grapher">
      <Header onButton={changePage}/>
      <Body current={page}/>
    </div>
  );
}

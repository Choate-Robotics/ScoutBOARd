import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDContext } from "../library/scoutingData";
import {AutoPie, ChartTool, TrendGraph} from "./charts/ChartTool";
import WiredBoar from "../assets/WiredBoar.png";
import compileData from "../library/dataCompiler";
import BarChart from "./charts/BarChart";
import { useDrag, useDrop } from "react-dnd";
import {KEYS, SCALER} from "../library/dataKeys";

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

function average(arr, key) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === "TRUE") {
      //console.log(arr[i][key])
      sum += 1;
    }
    else if (arr[i][key] === "FALSE") {
      //console.log(arr[i][key])
      sum += 0;
    }
    else if (arr[i][key] === "null") {
      sum += 0;
    }
    else {
    sum += parseInt(arr[i][key]);
    }
  }
  let ave = sum / arr.length;
  return parseFloat(ave.toFixed(2));
  
}

function totalTelePoints(arr) {
  let TeleHigh = (average(arr, KEYS.Teleop.HighCone) + average(arr, KEYS.Teleop.HighCube)) * SCALER.Teleop.High
  let TeleMid = (average(arr, KEYS.Teleop.MidCone) + average(arr, KEYS.Teleop.MidCube)) * SCALER.Teleop.Mid
  let TeleLow = (average(arr, KEYS.Teleop.LowCone) + average(arr, KEYS.Teleop.LowCube)) * SCALER.Teleop.Low
  return TeleHigh + TeleMid + TeleLow
}

function totalAutoPoints(arr) {
  let AutoHigh = (average(arr, KEYS.Auto.HighCone) + average(arr, KEYS.Auto.HighCube)) * SCALER.Auto.High
  let AutoMid = (average(arr, KEYS.Auto.MidCone) + average(arr, KEYS.Auto.MidCube)) * SCALER.Auto.Mid
  let AutoLow = (average(arr, KEYS.Auto.LowCone) + average(arr, KEYS.Auto.LowCube)) * SCALER.Auto.Low
  let AutoMobility = average(arr, KEYS.Auto.Mobility) * SCALER.Auto.Mobility
  let AutoDock = average(arr, KEYS.Auto.ChargingStation.Docked) * SCALER.Auto.ChargingStation.Docked
  let AutoEngage = average(arr, KEYS.Auto.ChargingStation.Engaged) * SCALER.Auto.ChargingStation.Engaged
  return AutoHigh + AutoMid + AutoLow + AutoMobility + AutoDock + AutoEngage
}

function totalEndgamePoints(arr) {
  let EndgamePark = average(arr, KEYS.Endgame.Parked) * SCALER.Endgame.Parked
  let EndgameDock = average(arr, KEYS.Endgame.ChargingStation.Docked) * SCALER.Endgame.ChargingStation.Docked
  let EndgameEngage = average(arr, KEYS.Endgame.ChargingStation.Engaged) * SCALER.Endgame.ChargingStation.Engaged
  return EndgamePark + EndgameDock + EndgameEngage
}

function TeamList({ onTeam }) {
  const [scoutingData] = useContext(SDContext);
  const [filtered, setFiltered] = useState("Highest-Overall");
  const [flow, setFlow] = useState("Top to Bottom");


  function changeFilter(e) {
    setFiltered(e.target.value);
    console.log(e.target.value)
  }

  function changeFlow(e) {
    setFlow(e.target.value);
    console.log(e.target.value)
  }

    let data = scoutingData;
    if (filtered === "Highest-Overall") {
      data.sort((a, b) => {
        let aAvg = totalAutoPoints(a.matches) + totalTelePoints(a.matches) + totalEndgamePoints(a.matches);
        let bAvg = totalAutoPoints(b.matches) + totalTelePoints(b.matches) + totalEndgamePoints(b.matches);
        return bAvg - aAvg;
      });
    } else if (filtered === "Highest-Auto") {
      data.sort((a, b) => {
        let aAvg = totalAutoPoints(a.matches);
        let bAvg = totalAutoPoints(b.matches);
        return bAvg - aAvg;
      });
    } else if (filtered === "Highest-Tele") {
      data.sort((a, b) => {
        let aAvg = totalTelePoints(a.matches);
        let bAvg = totalTelePoints(b.matches);
        return bAvg - aAvg;
      });
    } else if (filtered === "Highest-End") {
      data.sort((a, b) => {
        let aAvg = totalEndgamePoints(a.matches);
        let bAvg = totalEndgamePoints(b.matches);
        return bAvg - aAvg;
      });
    }

    if (flow === "Bottom to Top") {
      data.reverse();
    }


  return (
    <div className="team-list">
      <select className="team-list-filter" onChange={changeFilter}>
          <option value="Highest-Overall">Overall</option>
          <option value="Highest-Auto">Auto</option>
          <option value="Highest-Tele">Tele</option>
          <option value="Highest-End">End</option>
      </select> 
      <select className="team-list-flow" onChange={changeFlow}>
          <option value="Top to Bottom">Top to Bottom</option>
          <option value="Bottom to Top">Bottom to Top</option>
      </select> <small>*Averaged over all matches*</small>
      <table className="team-list-table">
        <thead>
          <th>Team #</th>
          <th>
            <p>Auto pts</p>
          </th>
          <th>
            <p>Tele pts</p>
          </th>
          <th>
            <p>End pts</p>
          </th>
        </thead>
        {data.map((team, i) => (
            <tr key={i} team={team.team} onClick={onTeam}>
              <td>{team.team}</td>
              <td>{totalAutoPoints(team.matches).toFixed(2)}</td>
              <td>{totalTelePoints(team.matches).toFixed(2)}</td>
              <td>{totalEndgamePoints(team.matches).toFixed(2)}</td>
            </tr>
        ))}
      </table>
    </div>
  );
}


function AutoGraph({ team }) {
  const autoLabels = [
    "High Cone",
    "High Cube",
    "Mid Cone",
    "Mid Cube",
    "Low Cone",
    "Low Cube",
    "Mobility",
    "Docked",
    "Engaged",
  ];
  
  const autoData = [
    KEYS.Auto.HighCone,
    KEYS.Auto.HighCube,
    KEYS.Auto.MidCone,
    KEYS.Auto.MidCube,
    KEYS.Auto.LowCone,
    KEYS.Auto.LowCube,
    KEYS.Auto.Mobility,
    KEYS.Auto.ChargingStation.Docked,
    KEYS.Auto.ChargingStation.Engaged,
  ];
  const total = ["TotalAuto"];
  return (
    <div className="charts-wrapper">
      <AutoPie team={team} labels={autoLabels} data={autoData} title={"Ave. Auto"}/>
      {/* <ChartTool team={team} labels={total} chartType={"bar"}/> */}
    </div>
  );
}

function TeleGraph({ team }) {
  const teleLabels = [
    "High Cone",
    "High Cube",
    "Mid Cone",
    "Mid Cube",
    "Low Cone",
    "Low Cube",
  ];
  
  const teleData = [
    KEYS.Teleop.HighCone,
    KEYS.Teleop.HighCube,
    KEYS.Teleop.MidCone,
    KEYS.Teleop.MidCube,
    KEYS.Teleop.LowCone,
    KEYS.Teleop.LowCube,
  ];
  const total = ["TotalTele"];

  const rscale = {
    r: {
      suggestedMax: 6,
    }
  }

  const bscale = {
    x: {},
    y: {
      max: 20,
      min: 0,
    }
  }

  return (
    <div className="charts-wrapper">
      <ChartTool team={team} labels={teleLabels} data={teleData} scale={rscale} chartType={"radar"}/>
      {/* <ChartTool team={team} labels={total} scale={bscale} chartType={"bar"}/> */}
    </div>
  );
}                  


function EndGraph({ team }) {
  const endLabels = [
    "Docked",
    "Engaged",
    "Parked",
  ]
  
  const endData = [
    KEYS.Endgame.ChargingStation.Docked,
    KEYS.Endgame.ChargingStation.Engaged,
    KEYS.Endgame.Parked
  ];
  const trend = ["TotalAuto", "TotalTele", "Charging Station", "TotalPieces"]
  return (
    <div className="charts-wrapper">
        <ChartTool team={team} labels={endLabels} data={endData} chartType={"radar"} />
        {/* <TrendGraph team={team} label={"Match Num"} targets={trend} title={"Total Trend"}/> */}
    </div>
    );
}

function TeamPage() {
  const [scoutingData] = useContext(SDContext);
  let [team, setTeam] = useState(0);

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

function PickListItem({item, num, Click}){


    return (
        <div key={num} rank={num} team={item} onClick={Click} className="pick-list-item">
            <p>{num + 1}</p>
            <h3>{item}</h3>
        </div>
    ) 
}

function PickList({list, Click}) {

    return (
        <div className="pick-list">
            {list.length == 0 ? <h3>Empty</h3> : null}
            {list.map((item, i) => (
                <PickListItem item={item} Click={Click} num={i}/>
            ))}

        </div>
    )
}

function PickListPage() {

    const [listOne, setListOne] = useState([])
    const [listTwo, setListTwo] = useState([])
    

    function addToListOne(e){
        console.log(e.currentTarget)
        if (e.currentTarget.getAttribute("team") === null) {
            return;
        }
        if(listOne.includes(e.currentTarget.getAttribute("team"))){
            return;
        }
        setListOne([...listOne, e.currentTarget.getAttribute("team")])
        console.log(listOne)
    }

    function deleteFromListOne(e){
        //removes item from list using team name
        console.log(e.currentTarget)
        if (e.currentTarget.getAttribute("team") === null) {
            return;
        }
        let newList = listOne.filter((item) => item != e.currentTarget.getAttribute("team"))
        setListOne(newList)
        


    }

    function addToListTwo(e){

    }

    function deleteFromListTwo(e){

    }

    return (
        <div className="pick-list-page">
            <div className="team-page-list">
                <h2>Team List</h2>
                <TeamList onTeam={addToListOne}/>
            </div>
            <div className="pick-list-page-lists">
                <div className="pick-list-page-list">
                    <h3>1st Pick List</h3>
                    <PickList list={listOne} Click={deleteFromListOne}/>
                </div>
                <div className="pick-list-page-list">
                    <h3>2nd Pick List</h3>
                    <PickList list={listTwo}/>
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

import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDContext } from "../library/scoutingData";
import {AutoPie, ChartTool, DoughnutChartTool, TrendGraph} from "./charts/ChartTool";
import WiredBoar from "../assets/WiredBoar.png";
import compileData from "../library/dataCompiler";
import BarChart from "./charts/BarChart";
import { useDrag, useDrop } from "react-dnd";
import {KEYS, SCALER} from "../library/dataKeys";
import average from "../library/dataAverageTool";

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
          {/* <button value={"Graph"} onClick={onButton} className="header-division-button">Graph</button>
          <button value={"Compare"} onClick={onButton} className="header-division-button">Compare</button> */}
          <button value={"Lists"} onClick={onButton} className="header-division-button">Pick Lists</button>
        </div>
      </div>
    </header>
  );
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

  const autoDataMultiply = [
    SCALER.Auto.High,
    SCALER.Auto.High,
    SCALER.Auto.Mid,
    SCALER.Auto.Mid,
    SCALER.Auto.Low,
    SCALER.Auto.Low,
    SCALER.Auto.Mobility,
    SCALER.Auto.ChargingStation.Docked,
    SCALER.Auto.ChargingStation.Engaged
  ]

  const total = ["TotalAuto"];

  const plugins = {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Ave. Auto",
    },
  }

  const rscale = {
    r: {
      suggestedMax: 3,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        display: false,
      },
      pointLabels: {
        display: true,
        centerPointLabels: true,
        font: {
          size: 8
        }
      },
    },
  };

  


  return (
    <div className="charts-wrapper">
      <AutoPie team={team} labels={autoLabels} data={autoData} scale={rscale} plugins={plugins}/>
      <TrendGraph team={team} labels={autoLabels} targets={autoData} multiply={autoDataMultiply} stacked={true} axis={'y'} />
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

  const teleDataMultiply = [
    SCALER.Teleop.High,
    SCALER.Teleop.High,
    SCALER.Teleop.Mid,
    SCALER.Teleop.Mid,
    SCALER.Teleop.Low,
    SCALER.Teleop.Low,
  ];

  const driverLabels = [
    "Driving Skill",
    "Defensive Skill",
  ]

  const driverData =[
    KEYS.Rating.Driver,
    KEYS.Rating.Defense,
  ]

  const dscale = {
    r: {
      ticks: {
        display: false,
      },
    }
  }

  const rscale = {
    r: {
      suggestedMin: 6,
      suggestedMax: 10,
      grid: {
        color: 'blue'
    },
    angleLines: {
        color: 'red'
    },
    ticks: {
      stepSize: 2,
    },
    }
  }

  const rplugins = {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Ave. Tele',
    },
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
      <TrendGraph team={team} labels={teleLabels} targets={teleData} multiply={teleDataMultiply} stacked={true} />
      {/* <ChartTool team={team} labels={teleLabels} data={teleData} scale={rscale} plugins={rplugins} chartType={"radar"}/> */}
      <DoughnutChartTool team={team} labels={teleLabels} data={teleData} title={"Ave. Tele"}/>
      <ChartTool team={team} labels={driverLabels} data={driverData} scale={dscale} chartType={"bar"} />
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
  const trend = ["TotalAuto", "TotalTele", "Charging Station"]
  return (
    <div className="charts-wrapper">
        {/* TODO: ADD NOTHING TABLE TO CHART. */}
        <DoughnutChartTool team={team} labels={endLabels} data={endData} title={"Ave. Endgame"} />
        {/* <ChartTool team={team} labels={endLabels} data={endData} chartType={"radar"} /> */}
        {/* <TrendGraph team={team} label={"Match Num"} targets={trend} title={"Total Trend"}/> */}
    </div>
    );
}

function TeamInfo({ team }) {
  const [scoutingData] = useContext(SDContext);

  let teamInfo = scoutingData.filter((match) => match.team === team)[0] || {matches: []};

  let defense = (average(teamInfo.matches, KEYS.DefenseBot) > 0.5) ? "Yes" : "No";
  return (
    <div className="team-info">
      <div className="team-info-left">
        <div className="title">
          <h3>Scouting:</h3>
        </div>
        <h4>Scouted Matches: {teamInfo.matches.map((match) => "Match " + match[KEYS.MatchNum] + ", ")}</h4>
        <p>Scouters: {teamInfo.matches.map((match) => match[KEYS.ScouterName] + ", ")}</p>
      </div>
      <div className="team-info-middle">
        <div className="title">
          <h3>Team Info:</h3>
        </div>
        <p>Team Number: {team}</p>
        <p>Defense Bot: {defense}</p>
        <p>Autos: {teamInfo[KEYS.Pit.Autos]}</p>
      </div>
      <div className="team-info-right">
        <div className="title">
          <h3>Comments:</h3>
        </div>
        <div className={"team-info-right-comments"}>
          {teamInfo.matches.map((match) => (
            <div className="team-info-right-comments-match">
              <h4>Match: {match[KEYS.MatchNum]}</h4>
              <p>Scouter: {match[KEYS.ScouterName]}</p>
              <p>Comments: {(match[KEYS.Comments] == "")? "None": match[KEYS.Comments]}</p>
            </div>
          )
          )}
        </div>
      </div>
    </div>
  )
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
      <div className="team-page-info">
      <div className="team-page-info-top">
        <TeamInfo team={team} />
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
    </div>
  );
}

function PickListItem({item, num, Click, input}){

    let inn =  num + 1;

    return (
        <div key={num} rank={num} team={item} className="pick-list-item">
            {/* <p>{num + 1}</p> */}
            <input type={"Number"} onChange={input} min={1} max={20} placeholder={inn}/>
            <h3>{item}</h3>
            <h4 onClick={Click} team={item}>X</h4>
        </div>
    ) 
}

function PickList({list, Click, input}) {
    let classNames = "pick-list"


    return (
        <div className={classNames}>
            {list.length == 0 ? <h3>Empty</h3> : null}
            {list.map((item, i) => (
                <PickListItem item={item} input={input} Click={Click} num={i}/>
            ))}

        </div>
    )
}

function PickListPage() {

    const [listOne, setListOne] = useState([])
    const [listTwo, setListTwo] = useState([])
    
    const [listSelector, setListSelector] = useState(1)

    const [classListOne, setClassListOne] = useState("pick-list-page-list enabled")
    const [classListTwo, setClassListTwo] = useState("pick-list-page-list disabled")



    function selectListOne() {
      setListSelector(1)
      setClassListOne("pick-list-page-list enabled")
      setClassListTwo("pick-list-page-list disabled")
    }

    function selectListTwo() {
      setListSelector(2)
      setClassListTwo("pick-list-page-list enabled")
      setClassListOne("pick-list-page-list disabled")
    }

    function addToList(e){
        console.log(e.currentTarget)
        let tempList
        if (listSelector == 1) {
            tempList = listOne
        } else {
            tempList = listTwo
        }
        if (tempList.length >= 20) {
            return;
        }
        if (e.currentTarget.getAttribute("team") === null) {
            return;
        }
        if(tempList.includes(e.currentTarget.getAttribute("team"))){
            return;
        }
        if (listSelector == 1) {
            setListOne([...tempList, e.currentTarget.getAttribute("team")])
            console.log(listOne)
        } else {
            setListTwo([...tempList, e.currentTarget.getAttribute("team")])
            console.log(listTwo)
        }
    }

    function reOrderList(e) {
      e.preventDefault();
      console.log(e.currentTarget.value)
      console.log(e.currentTarget.parentNode.getAttribute("rank"))
      // reorder list acording to input value
      let newList 
      if (listSelector == 1) {
        newList = listOne
      } else {
        newList = listTwo
      }
      let item = newList.splice(e.currentTarget.parentNode.getAttribute("rank"), 1);
      newList.splice(e.currentTarget.value - 1, 0, item[0]);
      console.log(newList)
      e.currentTarget.value = "";
      if (listSelector == 1) {
        setListOne([...newList]);
      } else {
        setListTwo([...newList]);
      }
    }

    function deleteFromList(e){
        //removes item from list using team name
        console.log(e.currentTarget)
        if (e.currentTarget.getAttribute("team") === null) {
            return;
        }
        let newList
        if (listSelector == 1) {
            newList = listOne.filter((item) => item != e.currentTarget.getAttribute("team"))
        } else {
            newList = listTwo.filter((item) => item != e.currentTarget.getAttribute("team"))
        }
        if (listSelector == 1) {
            setListOne(newList)
        } else {
            setListTwo(newList)
        }
        


    }


    return (
        <div className="pick-list-page">
            <div className="team-page-list">
                <h2>Team List</h2>
                <TeamList onTeam={addToList}/>
            </div>
            <div className="pick-list-page-lists">
                <div className={classListOne} onClick={selectListOne}>
                    <h3>1st Pick List</h3>
                    <PickList list={listOne}  input={reOrderList} Click={deleteFromList}/>
                </div>
                <div className={classListTwo} onClick={selectListTwo}>
                    <h3>2nd Pick List</h3>
                    <PickList list={listTwo}  input={reOrderList} Click={deleteFromList}/>
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
        // case "Graph":
        //     return (
        //         <div className="body">
        //         </div>
        //     )
        // case "Compare":
        //     return (
        //         <div className="body">
        //         </div>
        //     )
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

import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDContext } from "../library/scoutingData";
import RadarChart from "./charts/RadarChart";
import BarChart from "./charts/BarChart";
import WiredBoar from "../assets/WiredBoar.png";
import compileData from "../library/dataCompiler";
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
    )
}

function TeamList() {
    const [scoutingData] = useContext(SDContext);
    let teams = scoutingData.map((team) => team.team)
    return (
        
        <div className="team-list">
            <ul>
                {teams.map((team) => <li>{team}</li>)}
            </ul>
        </div>
    )
}

function GraphTool({team}, [labels]) {
    const [scoutingData] = useContext(SDContext);
    console.log(labels)
    let match_datasets = []
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    console.log(index)
    let name = "Match: "
    for (let i = 0; i < scoutingData[index].matches.length; i++) {
        let match = {label: "", data: []}
        for (let j = 0; j < labels.length; j++) {
            match.label = name.concat(scoutingData[index].matches[i]["Match Num"])
            
            match.data.push(scoutingData[index].matches[i][labels[j]])
        }
        match_datasets.push(match)
    }
    const data = {
        labels: labels,
        datasets: match_datasets
    }

    const options = {
        responsive: true
    }
    return (
        <div className="chart-container">
            <RadarChart data={data} options={options} />
        </div>
    )
}

function AutoGraph({ team }) {
    const [scoutingData] = useContext(SDContext);
    const sData = scoutingData
    let autos = ["AutoHighCones", "AutoMidCones", "AutoLowCones", "AutoHighCubes", "AutoMidCubes", "AutoLowCubes", "AutoHybrid"]
    let match_datasets = []
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    console.log(index)
    let name = "Match: "
    let stack = "Stack "
    for (let i = 0; i < scoutingData[index].matches.length; i++) {
        let match = {label: "", data: [], stack: ""}
        for (let j = 0; j < autos.length; j++) {
            match.label = name.concat(sData[index].matches[i]["Match Num"])
            match.data.push(sData[index].matches[i][autos[j]])
            match.stack = stack.concat([i])
        }
        match_datasets.push(match)
    }
    const data = {
        labels: autos,
        datasets: match_datasets
    }

    const options = {
        responsive: true,
    }

    console.log(data)

    return (
        <div className="chart-container">
            <RadarChart data={data} options={options} />
        </div>
    )
}

function TeleGraph({ team }) {
    let objects = ["TeleHighCones", "TeleMidCones", "TeleLowCones", "TeleHighCubes", "TeleMidCubes", "TeleLowCubes", "TeleHybrid"]
    
    return (
        <GraphTool team={team} label={objects} />
    )
}

function TeamPage() {
    return (
        <div className="team-page">
            <div className="team-page-list">
                <h2>Team Data: </h2>
                <TeamList />
            </div>
            <div className="team-page-graph">
                <div className="team-page-graph-auto">
                    <h3>Auto</h3>
                    <AutoGraph team={125} />
                </div>
                <div className="team-page-graph-tele">
                    <h3>Tele</h3>
                    <TeleGraph team={125} />
                </div>
                <div className="team-page-graph-end">
                    <h3>End</h3>

                </div>
            </div>
        </div>
    )
}


function body() {
    return (
        <div className="body">
            <TeamPage />
        </div>
    )
}

export function ScoutPage() {
    
    return (
        <div className="Scout-Grapher">
            {header()}
            {body()}
        </div>
    )
}
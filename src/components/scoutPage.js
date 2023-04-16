import react from "react";
import { useState, useContext } from "react";
import papa from "papaparse";
import { SDContext } from "../library/scoutingData";
import RadarChart from "./charts/RadarChart";
import WiredBoar from "../assets/WiredBoar.png";
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
    let teamList = [];
    for (let i = 0; i < scoutingData.length; i++) {
        teamList.push(scoutingData[i]["Team Num"]);
    }
    teamList = [...new Set(teamList)];
    teamList.sort();
    return (
        <div className="team-list">
            {teamList.map((team) => (
                <div className="team-list-item">
                    <h3>{team}</h3>
                </div>
            ))}
        </div>
    )
}


function body() {
    return (
        <div className="body">
            <div className="body-left">

            </div>
            <div className="body-right">

            </div>
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
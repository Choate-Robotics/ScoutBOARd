import React from "react";
import { useContext } from "react";
import { SDRContext, IKContext, SDContext } from "../library/scoutingData";

export default function compileData() {

    const [scoutingDataRaw,] = useContext(SDRContext);
    const [scoutingData, setScoutingData] = useContext(SDContext);

    const keysToRemove = ["Team Num"];


    function filterData(data) {
        const filteredData = {};
        for (let key in data) {
        if (!keysToRemove.includes(key)) {
            filteredData[key] = data[key];
        }
        }
        return filteredData;
    }

    // compile datasets of same team
    let teamData = [];
    for (let i = 0; i < scoutingDataRaw.length; i++) {
        let teamNum = scoutingDataRaw[i]["Team Num"];
        if (teamData.map((team) => team.team).includes(teamNum)) {
            teamData[teamData.map((team) => team.team).indexOf(teamNum)].matches.push(filterData(scoutingDataRaw[i]));
        } else {
            teamData.push({ team: teamNum, matches: [filterData(scoutingDataRaw[i])] });
        }
    }

    setScoutingData(teamData);
    console.log("Scouting Data Compiled")
    console.log(teamData)
}
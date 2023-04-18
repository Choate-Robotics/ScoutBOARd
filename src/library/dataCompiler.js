import React from "react";
import { useContext } from "react";
import { SDRContext, IKContext, SDContext } from "../library/scoutingData";
import { KEYS } from "./dataKeys";

export default function compileData() {

    const [scoutingDataRaw,] = useContext(SDRContext);
    const [scoutingData, setScoutingData] = useContext(SDContext);

    const keysToRemove = [KEYS.TeamNum];
    console.log("Compiling Scouting Data")
    console.log("TeamID", KEYS.TeamNum)

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
        let teamNum = scoutingDataRaw[i][KEYS.TeamNum];
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
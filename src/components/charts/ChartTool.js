import react from 'react';
import BarChart from './BarChart';
import RadarChart from './RadarChart';
import LineChart from './LineChart';
import { SDContext } from '../../library/scoutingData';
import { useContext } from 'react';


function ChartPicker({chartType, data, options}) {
    switch (chartType) {
        case "bar":
            return <BarChart data={data} options={options}/>
        case "radar":
            return <RadarChart data={data} options={options}/>
        case "line":
            return <LineChart data={data} options={options}/>
        default:
            return <BarChart data={data} options={options}/>
    }
}

export function ChartTool({team, labels, chartType}) {
    const [scoutingData] = useContext(SDContext);
    //console.log(labels)
    let match_datasets = []
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    //console.log(index)
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
            <ChartPicker chartType={chartType} data={data} options={options} />
        </div>
    )
}

export function TrendGraph({ team, label, targets }) {
    const [scoutingData] = useContext(SDContext);
    let match_datasets = []
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    let labels = scoutingData[index].matches.map((match) => match[label])
    for (let i = 0; i < targets.length; i++) {
        let data = scoutingData[index].matches.map((match) => match[targets[i]])
        let dataset = {
            label: targets[i],
            data: data,
            tension: 0.1
        }
        match_datasets.push(dataset)
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
            <BarChart data={data} options={options} />
        </div>
    )
}

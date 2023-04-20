import react from 'react';
import BarChart from './BarChart';
import RadarChart from './RadarChart';
import LineChart from './LineChart';
import DoughnutChart from './DoughnutChart';
import PolarAreaChart from './PolarAreaChart';
import { SDContext } from '../../library/scoutingData';
import { useContext } from 'react';
import { KEYS } from '../../library/dataKeys';
import average from '../../library/dataAverageTool';



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

export function ChartTool({team, labels, data, chartType, plugins, scale}) {
    if (!data || data == []) {
        data = labels
    }
    console.log(scale)
    const [scoutingData] = useContext(SDContext);
    //console.log(labels)
    let match_datasets = []
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    //console.log(index)
    let name = "Match: "
    for (let i = 0; i < scoutingData[index].matches.length; i++) {
        let match = {label: "", data: []}
        for (let j = 0; j < labels.length; j++) {
            match.label = name.concat(scoutingData[index].matches[i][KEYS.MatchNum])
            let dataEntry = scoutingData[index].matches[i][data[j]]
            if (dataEntry == "TRUE") {
                dataEntry = 1
            } else if (data == "FALSE") {
                dataEntry = 0
            }
            match.data.push(dataEntry)
        }
        match_datasets.push(match)
    }
    console.log(labels)
    console.log(match_datasets)
    const chartData = {
        labels: labels,
        datasets: match_datasets
    }
    let pluginOptions = {
        legend: {
            display: false,
        }
    }
    if (plugins){
        pluginOptions = plugins
    }
    let scaleOption = {
        r: {
        grid: {
            color: 'blue'
        },
        angleLines: {
            color: 'red'
        },
    },
    }
    if (scale){
        scaleOption = scale
    }

    let options = {
        responsive: true,
        plugins: pluginOptions,
        scales: scaleOption,
    }

    console.log(options)

    return (
        <div className="chart-container">
            <ChartPicker chartType={chartType} data={chartData} options={options} />
        </div>
    )
}

export function TrendGraph({ team, labels, targets, title, multiply, stacked, axis }) {
    const [scoutingData] = useContext(SDContext);
    let match_datasets = []
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    let label = scoutingData[index].matches.map((match) => match[KEYS.MatchNum])
    console.log("labels", label)
    for (let i = 0; i < targets.length; i++) {
        let data = scoutingData[index].matches.map((match) => {
            if(match[targets[i]] == "TRUE") {
                return 1 * multiply[i]
            } else if (match[targets[i]] == "FALSE") {
                return 0
            } else if (match[targets[i]] == "null") {
                return 0
            } else {
                return match[targets[i]] * multiply[i]
            }
        })
        let dataset = {
            label: labels[i],
            data: data,
            tension: 0.1
        }
        match_datasets.push(dataset)
    }
    console.log("datasets", match_datasets)
    const data = {
        labels: label,
        datasets: match_datasets
    }

    let scale = {}
    if (stacked) {
        scale = {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            },
        }
    }
    let indexAxis = "x"
    if (axis == "y") {
        indexAxis = "y"
    }

    const options = {
        responsive: true,
        plugins: {
            title: {
              display: true,
              text: title || "Match Trend",
            }
        },
        indexAxis: indexAxis,
        scales: scale,
    }

    console.log("Auto Trend Graph")
    console.log(data)
    console.log(options)

    return (
        <div className="chart-container">
            <BarChart data={data} options={options} />
        </div>
    )
}

export function DoughnutChartTool({ team, labels, data, title}) {
    
    if(!data || data == []) {
        data = labels
    }
        
    const [scoutingData] = useContext(SDContext);
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    let dataset = []
    for (let i = 0; i < labels.length; i++) {
        dataset.push(average(scoutingData[index].matches, data[i]))
    }
    const chartData = {
        labels: labels,
        datasets: [{
            label: "Tele",
            data: dataset,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title || "Auto",
            }
        }
    }
        return (
            <div className="chart-container">
                <DoughnutChart data={chartData} options={options} />
            </div>
        )
}


export function AutoPie({ team, labels, data, plugins, scale}) {
    
    if(!data || data == []) {
        data = labels
    }
    
    
    const [scoutingData] = useContext(SDContext);
    let index = scoutingData.findIndex((teamData) => teamData.team == team)
    let dataset = []
    for (let i = 0; i < labels.length; i++) {
        dataset.push(average(scoutingData[index].matches, data[i]))
    }
    const chartData = {
        labels: labels,
        datasets: [{
            label: "Auto",
            data: dataset,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    let pluginOptions = {
        legend: {
            display: false,
        }
    }
    if (plugins){
        pluginOptions = plugins
    }
    let scaleOption = {
        r: {
        grid: {
            color: 'blue'
        },
        angleLines: {
            color: 'red'
        },
    },
    }
    if (scale){
        scaleOption = scale
    }

    let options = {
        responsive: true,
        plugins: pluginOptions,
        scales: scaleOption,
    }
        return (
            <div className="chart-container">
                <PolarAreaChart data={chartData} options={options} />
            </div>
        )
}
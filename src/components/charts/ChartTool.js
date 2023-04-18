import react from 'react';
import BarChart from './BarChart';
import RadarChart from './RadarChart';
import LineChart from './LineChart';
import DoughnutChart from './DoughnutChart';
import PolarAreaChart from './PolarAreaChart';
import { SDContext } from '../../library/scoutingData';
import { useContext } from 'react';
import { KEYS } from '../../library/dataKeys';


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

export function ChartTool({team, labels, data, chartType, title, scale}) {
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
            
            match.data.push(scoutingData[index].matches[i][data[j]])
        }
        match_datasets.push(match)
    }
    const chartData = {
        labels: labels,
        datasets: match_datasets
    }
    let plugins = {}
    if (title){
        plugins = {
            title: {
                display: true,
                text: title || undefined,
            }
        }
    }
    let scaleOption
    if (scale){
        scaleOption = scale
    } else {
        scaleOption = {
            r: {
            grid: {
                color: 'blue'
            },
            angleLines: {
                color: 'red'
            },
        },
        }
    }

    let options = {
        responsive: true,
        plugins,
        scales: scaleOption,
    }

    console.log(options)

    return (
        <div className="chart-container">
            <ChartPicker chartType={chartType} data={chartData} options={options} />
        </div>
    )
}

export function TrendGraph({ team, label, targets, title }) {
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
        responsive: true,
        plugins: {
            title: {
              display: true,
              text: title || "Match Trend",
            }
        }
    }

    return (
        <div className="chart-container">
            <BarChart data={data} options={options} />
        </div>
    )
}

export function AutoPie({ team, labels, data, title}) {
    
    if(!data || data == []) {
        data = labels
    }
    
    function average(arr, key) {
    
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
          sum += parseInt(arr[i][key]);
        }
        let ave = sum / arr.length;
        //console.log(key, ave.toFixed(2))
        return parseFloat(ave.toFixed(2));
        
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
                <PolarAreaChart data={chartData} options={options} />
            </div>
        )
}
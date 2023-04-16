import react from 'react';
import {Radar} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function RadarChart({data, options}) {
    return ( <Radar data={data} options={options} />)
}

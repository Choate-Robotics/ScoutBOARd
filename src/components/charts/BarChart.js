import react from 'react';
import {Bar} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function RadarChart({data, options}) {
    return ( <Bar data={data} options={options} />)
}

import react from 'react';
import {PolarArea} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function PolarAreaChart({data, options}) {
    return ( <PolarArea data={data} options={options} />)
}

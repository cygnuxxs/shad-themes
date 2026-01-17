import React from 'react'
import { AreaChartGradient } from './area-chart-legend'
import { ChartBarMixed } from './bar-chart'
import { LineChartMultiple } from './line-chart'
import { RadialChart } from './radial-chart'

const ChartsDisplay = () => {
  return (
    <div className='grid md:grid-cols-2 py-2 gap-6'>
    <AreaChartGradient />
    <ChartBarMixed />
    <LineChartMultiple />
    <RadialChart />
    </div>
  )
}

export default ChartsDisplay
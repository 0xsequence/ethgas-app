import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { DataMode } from '~/stores/DataStore'

export const LineChart = ({ mode, data }) => {
  const xValues: string[] = []
  for (let i=data[0].data.length-1; i > 0; i-=2) {
    xValues.push(data[0].data[i].x)
  }

  let yLabel = ''
  if (mode === DataMode.ACTUAL) {
    yLabel = 'gas price paid (gwei)'
  } else {
    yLabel = 'suggested gas price (gwei)'
  }

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 50, bottom: 85, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'top',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 90,
        format: (value: number): string | number => {
          if (xValues.includes(`${value}`)) {
            return `${value}`
          } else {
            return ''
          }
        },
        legend: 'block #',
        legendOffset: 80,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: yLabel,
        legendOffset: -50,
        legendPosition: 'middle',
      }}
      colors={['#FFC542', '#3ED598', '#FF565E']}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: 'white'
            },
            line: {
              fill: 'red'
            }
          },
          legend: {
            text: {
              fill: 'white'
            }
          }
        },
        crosshair: {
          line: {
            stroke: 'white'
          }
        },
        legends: {
        },
        grid: {
          line: {
            stroke: '#333',
            strokeWidth: 2,
            // strokeDasharray: "4 4"
          }
        },
        tooltip: {
          container: {
            background: 'white',
            color: 'black',
            fontSize: '12px',
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
            padding: '5px 9px',
            textAlign: 'left'
          },
          basic: {
            whiteSpace: 'pre',
            display: 'flex',
            alignItems: 'left'
          },
          table: {},
          tableCell: {
            padding: '3px 5px'
          }
        }
      }}
      // pointSize={10}
      // pointColor={{ theme: 'background' }}
      // pointBorderWidth={2}
      // pointBorderColor={{ from: 'serieColor' }}
      // pointBorderColor={'red'}
      // pointLabel="y"
      // pointLabelYOffset={-12}
      useMesh={true}
      enablePoints={false}
      enableGridX={false}
      enableSlices={'x'}
      enableCrosshair={true}
    />
  )
}

import React from 'react'
import { ResponsiveLine } from '@nivo/line'

export const LineChart = ({ data }) => (
    <ResponsiveLine
      data={data}
      margin={{ top: 0, right: 50, bottom: 60, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'block #',
        legendOffset: 50,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'suggested gas price (gwei)',
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
        legends: {
        },
        markers: {
          lineColor: '#ff0000'
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
        },
        // crosshair: {
        //   line: {
        //     stroke: '#000000',
        //     strokeWidth: 5,
        //     strokeOpacity: 0.75,
        //     strokeDasharray: '6 6'
        //   }
        // },
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      enablePoints={false}
      enableGridX={true}
      enableSlices={'x'}

      // legends={[
      //     {
      //         anchor: 'bottom-right',
      //         direction: 'column',
      //         justify: false,
      //         translateX: 100,
      //         translateY: 0,
      //         itemsSpacing: 0,
      //         itemDirection: 'left-to-right',
      //         itemWidth: 80,
      //         itemHeight: 20,
      //         itemOpacity: 0.75,
      //         itemTextColor: 'white',
      //         symbolSize: 12,
      //         symbolShape: 'circle',
      //         symbolBorderColor: 'rgba(0, 0, 0, .5)',
      //         effects: [
      //             {
      //                 on: 'hover',
      //                 style: {
      //                     itemBackground: 'rgba(0, 0, 0, .03)',
      //                     itemOpacity: 1
      //                 }
      //             }
      //         ]
      //     }
      // ]}
    />
)

// export const lineData = [
//   {
//     "id": "slow",
//     "data": [
//       {
//         "x": "plane",
//         "y": 208
//       },
//       {
//         "x": "helicopter",
//         "y": 297
//       },
//       {
//         "x": "boat",
//         "y": 118
//       },
//       {
//         "x": "train",
//         "y": 239
//       },
//       {
//         "x": "subway",
//         "y": 148
//       },
//       {
//         "x": "bus",
//         "y": 255
//       },
//       {
//         "x": "car",
//         "y": 273
//       },
//       {
//         "x": "moto",
//         "y": 193
//       },
//       {
//         "x": "bicycle",
//         "y": 149
//       },
//       {
//         "x": "horse",
//         "y": 215
//       },
//       {
//         "x": "skateboard",
//         "y": 15
//       },
//       {
//         "x": "others",
//         "y": 196
//       }
//     ]
//   },
//   {
//     "id": "standard",
//     "data": [
//       {
//         "x": "plane",
//         "y": 77
//       },
//       {
//         "x": "helicopter",
//         "y": 274
//       },
//       {
//         "x": "boat",
//         "y": 2
//       },
//       {
//         "x": "train",
//         "y": 250
//       },
//       {
//         "x": "subway",
//         "y": 243
//       },
//       {
//         "x": "bus",
//         "y": 9
//       },
//       {
//         "x": "car",
//         "y": 58
//       },
//       {
//         "x": "moto",
//         "y": 224
//       },
//       {
//         "x": "bicycle",
//         "y": 226
//       },
//       {
//         "x": "horse",
//         "y": 175
//       },
//       {
//         "x": "skateboard",
//         "y": 270
//       },
//       {
//         "x": "others",
//         "y": 81
//       }
//     ]
//   },
//   {
//     "id": "fast",
//     "data": [
//       {
//         "x": "plane",
//         "y": 256
//       },
//       {
//         "x": "helicopter",
//         "y": 188
//       },
//       {
//         "x": "boat",
//         "y": 19
//       },
//       {
//         "x": "train",
//         "y": 105
//       },
//       {
//         "x": "subway",
//         "y": 198
//       },
//       {
//         "x": "bus",
//         "y": 176
//       },
//       {
//         "x": "car",
//         "y": 245
//       },
//       {
//         "x": "moto",
//         "y": 204
//       },
//       {
//         "x": "bicycle",
//         "y": 228
//       },
//       {
//         "x": "horse",
//         "y": 148
//       },
//       {
//         "x": "skateboard",
//         "y": 9
//       },
//       {
//         "x": "others",
//         "y": 249
//       }
//     ]
//   },
// ]

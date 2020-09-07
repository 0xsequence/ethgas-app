import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

export const BarChart = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
)

export const barData = [
  {
    "country": "AD",
    "hot dog": 122,
    "hot dogColor": "hsl(82, 70%, 50%)",
    "burger": 101,
    "burgerColor": "hsl(162, 70%, 50%)",
    "sandwich": 14,
    "sandwichColor": "hsl(310, 70%, 50%)",
    "kebab": 183,
    "kebabColor": "hsl(105, 70%, 50%)",
    "fries": 124,
    "friesColor": "hsl(89, 70%, 50%)",
    "donut": 114,
    "donutColor": "hsl(265, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 64,
    "hot dogColor": "hsl(15, 70%, 50%)",
    "burger": 100,
    "burgerColor": "hsl(256, 70%, 50%)",
    "sandwich": 165,
    "sandwichColor": "hsl(155, 70%, 50%)",
    "kebab": 134,
    "kebabColor": "hsl(38, 70%, 50%)",
    "fries": 183,
    "friesColor": "hsl(360, 70%, 50%)",
    "donut": 11,
    "donutColor": "hsl(2, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 168,
    "hot dogColor": "hsl(254, 70%, 50%)",
    "burger": 146,
    "burgerColor": "hsl(238, 70%, 50%)",
    "sandwich": 87,
    "sandwichColor": "hsl(90, 70%, 50%)",
    "kebab": 116,
    "kebabColor": "hsl(75, 70%, 50%)",
    "fries": 10,
    "friesColor": "hsl(154, 70%, 50%)",
    "donut": 48,
    "donutColor": "hsl(207, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 88,
    "hot dogColor": "hsl(25, 70%, 50%)",
    "burger": 26,
    "burgerColor": "hsl(334, 70%, 50%)",
    "sandwich": 50,
    "sandwichColor": "hsl(287, 70%, 50%)",
    "kebab": 161,
    "kebabColor": "hsl(43, 70%, 50%)",
    "fries": 17,
    "friesColor": "hsl(175, 70%, 50%)",
    "donut": 18,
    "donutColor": "hsl(85, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 90,
    "hot dogColor": "hsl(177, 70%, 50%)",
    "burger": 144,
    "burgerColor": "hsl(47, 70%, 50%)",
    "sandwich": 8,
    "sandwichColor": "hsl(18, 70%, 50%)",
    "kebab": 13,
    "kebabColor": "hsl(343, 70%, 50%)",
    "fries": 191,
    "friesColor": "hsl(155, 70%, 50%)",
    "donut": 5,
    "donutColor": "hsl(148, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 8,
    "hot dogColor": "hsl(85, 70%, 50%)",
    "burger": 187,
    "burgerColor": "hsl(281, 70%, 50%)",
    "sandwich": 60,
    "sandwichColor": "hsl(225, 70%, 50%)",
    "kebab": 104,
    "kebabColor": "hsl(200, 70%, 50%)",
    "fries": 195,
    "friesColor": "hsl(301, 70%, 50%)",
    "donut": 66,
    "donutColor": "hsl(66, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 58,
    "hot dogColor": "hsl(222, 70%, 50%)",
    "burger": 18,
    "burgerColor": "hsl(102, 70%, 50%)",
    "sandwich": 146,
    "sandwichColor": "hsl(174, 70%, 50%)",
    "kebab": 51,
    "kebabColor": "hsl(258, 70%, 50%)",
    "fries": 181,
    "friesColor": "hsl(52, 70%, 50%)",
    "donut": 79,
    "donutColor": "hsl(52, 70%, 50%)"
  }
]

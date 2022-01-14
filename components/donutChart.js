import React from "react";
import { PieChart, Pie, Label, Cell } from 'recharts';

//  var startValue = .32
//  var endValue = .59
//  var meanValue = .51
//  var a = Math.round(((meanValue-startValue) / (endValue-startValue)) * 100)
//  var b = 100 - a

// const data = [
//   { name: "0.32", value: 0 },
//   { name: "", value: a },
//   { name: "", value: b },   
//   { name: "0.59", value: 0 },  
// ];
const COLORS = ['#0088FE', '#0088FE', '#DBE2EF', '#0088FE'];
//const COLORS = ['#284b63', '#284b63', '#d9d9d9', '#284b63'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x < 200 ? x+15 : x-15 }
      y={y + 10 }
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {name}
    </text>
  );
};

export default function donutChart(props) {
  var startValue = props.pieData.min
  var endValue = props.pieData.max
  var meanValue = props.pieData.mean
  var a = Math.round(((meanValue-startValue) / (endValue-startValue)) * 100)
  var b = 100 - a
  var data=[
    { name: Number(props.pieData.min).toFixed(2), value: 0 },
    { name: "", value: a },
    { name: "", value: b },   
    { name: Number(props.pieData.max).toFixed(2), value: 0 },  
  ]
  return (
    
    <PieChart width={430} height={300}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={data}
        cx={200}
        cy={210}
        outerRadius={170}
        innerRadius={130}
        labelLine={false}
        label={renderCustomizedLabel}
        
      >

        <Label value={Number(props.pieData.mean).toFixed(2)} position="center" fontSize="60"/>
        
        {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
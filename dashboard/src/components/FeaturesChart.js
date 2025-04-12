//keep track of how many times a feature is used with a pie chart
//keep track of how often feature is used with a line graph
"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';


export default function FeaturesChart() {
  const ref = useRef();

  const [chartData, setChartData] = useState(null);

  //useEffect to fetch data from firebase, store in chartData and categoryData
  useEffect(() => {
    const getData = async () => {
      console.log("Fetching Pet Data");

      try {
        const docRef = doc(db, "DashboardData", "PetCategories");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:" , docSnap.data());

          //format data
          const formattedData = Object.entries(docSnap.data()).map(([key, value]) => ({
            label: key,
            value: value
          }));

          console.log("Formatted Data: ", formattedData);

          //we might not even need these lol
          setChartData(formattedData); 
          setCategoryData(docSnap.data());

        } else {
          console.log("Cannot find document");
        }

        
      } catch (err) {
        console.log("could not get pet categories");
        console.log(err);
      }
    };

    getData();
  }, []);

  //useEffect to create chart
  useEffect( () => {
    if (!chartData) {
      console.log("No chart data");
      return;
    }

    console.log("Chart Data:", chartData);

    const svg = d3.select(ref.current)
      .attr('width', 600)
      .attr('height', 600);

    // Add a title to the chart
    svg.append('text')
      .attr('x', 300) 
      .attr('y', 20) //title centered at the top
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text('Pet Categories'); 

    const g = svg.append('g')
      .attr('transform', 'translate(300,300)');

    const radius = 200;

    const pie = d3.pie().value(d => d.value)

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const outerArc = d3.arc().innerRadius(radius + 20).outerRadius(radius + 20);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pieData = pie(chartData);

    g.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc) 
      .attr('fill', (d, i) => color(i)) 
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // add labels
    g.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .attr('transform', d => {
        const centroid = arc.centroid(d); 
        const [x, y] = centroid;
        const isSmallSlice = d.endAngle - d.startAngle < 0.5; //if isSmallSlice use outer arc
        return isSmallSlice ? `translate(${outerArc.centroid(d)})` : `translate(${x},${y})`;
      })
      .attr('text-anchor', d => {
        const isSmallSlice = d.endAngle - d.startAngle < 0.2;
        return isSmallSlice ? (outerArc.centroid(d)[0] > 0 ? 'start' : 'end') : 'middle';
      })
      .attr('font-size', '12px')
      .attr('fill', d => {
        const isSmallSlice = d.endAngle - d.startAngle < 0.2;
        return isSmallSlice ? 'black' : 'white'; // adjust for color
      })
      .text(d => {
        const percentage = ((d.value / d3.sum(chartData, d => d.value)) * 100).toFixed(1);
        return `${d.data.label} (${d.data.value}, ${percentage}%)`;
      });

  }, [chartData]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref}></svg>
    </div>
  );
}

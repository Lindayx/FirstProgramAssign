//keep track of how many times a feature is used with a pie chart
//keep track of how often feature is used with a line graph
"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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
          console.log("Document data:", docSnap.data());

          //format data
          const formattedData = Object.entries(docSnap.data()).map(
            ([key, value]) => ({
              label: key,
              value: value,
            })
          );

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

  //drawing  chart and now adding legend

  useEffect(() => {
    if (!chartData) {
      console.log("No chart data");
      return;
    }
    // theme detection
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches; // feature detects from os whether user on light/dark
    // const backgroundColor = isDarkMode? '#1e1e1e' : '#ffffff';
    const sliceLabelColor = isDarkMode ? "#ffffff" : "#000000";
    const smallSliceColor = "black";

    console.log("Chart Data:", chartData);

    const svg = d3
      .select(ref.current)
      .attr("width", 600)
      .attr("height", 660); // increased height for LEGEND

    // svg.selectAll('*').remove(); // clear+draw background
    // svg.append('rect')
    //   .attr('width', 600)
    //   .attr('height', 600)
    //   .attr('fill', backgroundColor);

    // Add a title to the chart
    svg
      .append("text")
      .attr("x", 300)
      .attr("y", 20) //title centered at the top
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", sliceLabelColor)
      .text("Pet Categories");

    const g = svg.append("g").attr("transform", "translate(300,300)");

    const radius = 200;

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const outerArc = d3
      .arc()
      .innerRadius(radius + 20)
      .outerRadius(radius + 20);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pieData = pie(chartData);

    g.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // add labels
    g.selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const centroid = arc.centroid(d);
        const [x, y] = centroid;
        const isSmallSlice = d.endAngle - d.startAngle < 0.5; //if isSmallSlice use outer arc
        return isSmallSlice
          ? `translate(${outerArc.centroid(d)})`
          : `translate(${x},${y})`;
      })
      .attr("text-anchor", (d) => {
        const isSmallSlice = d.endAngle - d.startAngle < 0.2;
        return isSmallSlice
          ? outerArc.centroid(d)[0] > 0
            ? "start"
            : "end"
          : "middle";
      })
      .attr("font-size", "12px")
      .attr("fill", (d) => {
        const isSmallSlice = d.endAngle - d.startAngle < 0.2;
        return isSmallSlice ? smallSliceColor : sliceLabelColor; // adjust for color
      })
      .text((d) => {
        const percentage = (
          (d.value / d3.sum(chartData, (d) => d.value)) *
          100
        ).toFixed(1);
        return `${d.data.label} (${d.data.value}, ${percentage}%)`;
      });

      // LEGEND ADDITION
  const legendY = 540;
  const boxSize = 16; // size of legend box
  const boxGap = 6; // gap between legend boxes
  const rowHeight = 24; // height of each row in the legend

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(20, ${legendY}`); // we want this below the pie

  // lets connect our actual data to LEGEND
  // for each category in chart data, we make one <g> row 
  const legendItems = legend.selectAll(".legend-item")
      .data(chartData)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(0, ${i * rowHeight})`) // we space this w/ row height

      // coloring legend
    legendItems.append("rect")
      .attr("width", boxSize)
      .attr("height", boxSize)
      .attr("fill", (_, i) => color(i)) // asscoaite pie chart colors to legend boxes

      // legend text/ render category name to right of each box
      legendItems.append("text")
      .attr("x", boxSize + boxGap)
      .attr("y", boxSize / 2 + 4) // center text vertically
      .attr("font-size", "12px")
      .attr("fill", sliceLabelColor)
      .text(d => d.label); // use the label from chart data

  }, [chartData]);

  
  return (
    <div className="flex flex-col items-center">
      <svg ref={ref}></svg>
    </div>
  );
}

//keep track of how many times a feature is used with a pie chart
//keep track of how often feature is used with a line graph
"use client";

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function FeaturesChart() {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', 300)
      .attr('height', 200);

    svg.append('circle')
      .attr('cx', 150)
      .attr('cy', 100)
      .attr('r', 40)
      .attr('fill', 'steelblue');
  }, []);

  return <svg ref={ref}></svg>;

}

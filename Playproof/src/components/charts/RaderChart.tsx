// src/components/charts/RaderChart.tsx

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  axis: string;
  value: number; // 0 ~ 100
}

interface RadarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  levels?: number;
  color?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  width = 300,
  height = 300,
  levels = 4,
  color = '#7C3AED', // Tailwind violet-600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;

    // Scale
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);

    // Draw the concentric circles (Grid)
    for (let i = 0; i < levels; i++) {
      const levelFactor = radius * ((i + 1) / levels);
      svg
        .selectAll('.levels')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', (_d, j) => levelFactor * Math.cos(angleSlice * j - Math.PI / 2))
        .attr('y1', (_d, j) => levelFactor * Math.sin(angleSlice * j - Math.PI / 2))
        .attr('x2', (_d, j) => levelFactor * Math.cos(angleSlice * (j + 1) - Math.PI / 2))
        .attr('y2', (_d, j) => levelFactor * Math.sin(angleSlice * (j + 1) - Math.PI / 2))
        .attr('class', 'grid-line')
        .style('stroke', '#CDCDCD')
        .style('stroke-opacity', '0.5')
        .style('stroke-width', '0.5px');
    }

    // Axes
    const axisGrid = svg.append('g').attr('class', 'axisWrapper');

    axisGrid
      .selectAll('.axis')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (_d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', '#999')
      .style('stroke-width', '1px');

    // Labels
    axisGrid
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (_d, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (_d, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d.axis)
      .style('fill', '#6B7280'); // gray-500

    // Radar Area
    const radarLine = d3
      .lineRadial<DataPoint>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((_d, i) => i * angleSlice);

    svg
      .append('path')
      .datum(data)
      .attr('d', radarLine)
      .style('stroke-width', 2)
      .style('stroke', color)
      .style('fill', color)
      .style('fill-opacity', 0.3);

    // Points
    svg
      .selectAll('.radarCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 4)
      .attr('cx', (_d, i) => rScale(data[i]?.value ?? 0) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (_d, i) => rScale(data[i]?.value ?? 0) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', color)
      .style('fill-opacity', 0.8);

  }, [data, width, height, levels, color]);

  return <svg ref={svgRef}></svg>;
};

export default RadarChart;

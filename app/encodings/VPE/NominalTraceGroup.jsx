import React from "react";
import { scaleBand, scaleLinear } from 'd3-scale'; 
import { schemeCategory10 } from 'd3-scale-chromatic'; 

class NominalTraceGroup extends React.Component {

    state = {
        valueScale: scaleBand(), 
        freqScale: scaleLinear(), 
        colors: schemeCategory10
    }

    render() {

        let { pplot } = this.props; 
        let { valueKey, valueDomain, observations, scaleRangeToBox, xRange, yRange, isLeft } = pplot; 
        let { freqScale, valueScale, colors } = this.state; 

        let scales = scaleRangeToBox(freqScale, valueScale); 
        freqScale = scales.xScale; 
        valueScale = scales.yScale; 

        freqScale.domain([0, 1.0]); 
        valueScale.domain(valueDomain); 

        let binHeight = 5; 

        let observationCounts = observations.reduce((acc, cur) => {
            let value = cur[valueKey]; 
            acc[value] = acc[value] === undefined ? 1 : acc[value] + 1; 
            return acc; 
        }, {}); 

        let xWidth = xRange[1] - xRange[0]; 
        let tx = xRange[0]; 
        let ty = yRange[1];

        return (
            <g transform={isLeft ? `translate(${xWidth + tx},${ty}) scale(-1,1) translate(${-tx},${-ty})` : ''}>
                {valueDomain.map((value,i) =>   <rect
                                                key={`${value}`}
                                                x={0}
                                                y={valueScale(value) + 2.5}
                                                width={freqScale(observationCounts[value] / observations.length)}
                                                height={binHeight}
                                                fill={colors[i]}/>)}
            </g>
        );  
    
    }

}

export default NominalTraceGroup; 


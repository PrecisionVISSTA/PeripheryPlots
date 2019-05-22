import React from "react";
import * as d3 from "d3"; 

class NominalTraceGroup extends React.Component {

    state = {
        valueScale: d3.scaleBand(), 
        freqScale: d3.scaleLinear(), 
        colors: d3.schemeCategory10
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = this.props; 
        let { freqScale, valueScale, colors } = this.state; 

        let scales = scaleRangeToBox(freqScale, valueScale); 
        freqScale = scales.xScale; 
        valueScale = scales.yScale; 

        freqScale.domain([0, 1.0]); 
        valueScale.domain(valueDomain); 

        let binHeight = 5; 

        let observationCounts = observations.reduce((acc, cur) => {
            let value = cur[valueKey]; 
            if (!Object.keys(acc).includes(value)) {
                acc[value] = 1; 
            } else {
                acc[value] += 1; 
            }
            return acc; 
        }, {}); 

        return (
            <g>
                {valueDomain.map((value,i) =>   <rect
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


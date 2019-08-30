import React from "react";
import * as d3 from "d3"; 

class AverageLine extends React.Component {

    state = {
        valueScale: d3.scaleLinear(), 

    }

    render() {

        let { pplot } = this.props;
        let { valueKey, valueDomain, xRange, observations, scaleRangeToBox } = pplot; 
        let { valueScale } = this.state; 

        let scales = scaleRangeToBox(null, valueScale); 
        valueScale = scales.yScale; 
        valueScale.domain([valueDomain[0], valueDomain[1]]); 

        let mean = d3.mean(observations.map(o => o[valueKey])); 
        let y = valueScale(mean); 

        return (
            <g>
                <line x1={xRange[0]} x2={xRange[1]} y1={y} y2={y} stroke="#f4b642" strokeDasharray="1 1"/>
            </g>
        );  
    
    }

}

export default AverageLine; 


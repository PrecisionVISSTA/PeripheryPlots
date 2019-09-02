import React from "react";
import { scaleLinear } from 'd3-scale'; 
import { mean } from 'd3-array'; 

class AverageLineGroup extends React.Component {

    state = {
        valueScale: scaleLinear(), 

    }

    render() {

        let { pplot } = this.props;
        let { valueKey, valueDomain, xRange, observations, scaleRangeToBox } = pplot; 
        let { valueScale } = this.state; 

        let scales = scaleRangeToBox(null, valueScale); 
        valueScale = scales.yScale; 
        valueScale.domain([valueDomain[0], valueDomain[1]]); 

        let y = valueScale(mean(observations.map(o => o[valueKey]))); 

        return (
            <g>
                <line x1={xRange[0]} x2={xRange[1]} y1={y} y2={y} stroke="#f4b642" strokeDasharray="1 1"/>
            </g>
        );  
    
    }

}

export default AverageLineGroup; 


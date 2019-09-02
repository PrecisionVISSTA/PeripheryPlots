import React from "react";
import { line, curveMonotoneX } from 'd3-shape'; 
import { scaleLinear, scaleTime } from 'd3-scale'; 

class LineGroup extends React.Component {

    state = {
        line: line().curve(curveMonotoneX), 
        timeScale: scaleTime(), 
        valueScale: scaleLinear()
    }

    render() {

        let { pplot } = this.props; 
        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = pplot; 
        let { line, timeScale, valueScale } = this.state

        let scales = scaleRangeToBox(timeScale, valueScale); 
        timeScale = scales.xScale; 
        valueScale = scales.yScale; 

        timeScale.domain(timeDomain); 
        valueScale.domain(valueDomain); 
    
        line.x(d => timeScale(d[timeKey]))
            .y(d => valueScale(d[valueKey]));

        return (
            <g>
                {/* Line */}
                <path d={line(observations)} fill="none" stroke="steelblue"/>
            </g>
        );  
    
    }

}

export default LineGroup; 


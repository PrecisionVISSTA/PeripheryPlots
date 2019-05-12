import React from "react";
import * as d3 from "d3"; 

class LineGroup extends React.Component {

    state = {
        line: d3.line()
                .curve(d3.curveMonotoneX), 
        timeScale: d3.scaleTime(), 
        valueScale: d3.scaleLinear()
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = props; 
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
                <path d={line(observations)} fill="black"/>
                {/* Data Points */}
                {observations.map(o => <circle 
                                        cx={timeScale(o[timeKey])}
                                        cy={valueScale(o[valueScale])}
                                        r={3}
                                        stroke="black" 
                                        strokeWidth={1} 
                                        fill="white"/>)}
            </g>
        );
    
    }

}

export default LineGroup; 


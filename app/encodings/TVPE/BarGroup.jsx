import React from "react";
import * as d3 from "d3"; 

const BAR_WIDTH = 3; 

class BarGroup extends React.Component {

    state = {
        timeScale: d3.scaleTime(), 
        valueScale: d3.scaleLinear()
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = this.props; 
        let { line, timeScale, valueScale } = this.state

        let scales = scaleRangeToBox(timeScale, valueScale); 
        timeScale = scales.xScale; 
        valueScale = scales.yScale; 

        timeScale.domain(timeDomain); 
        valueScale.domain(valueDomain); 

        let height = valueScale.range()[0]; 

        return (
            <g>
                {/* Bars */}
                {observations.map(o => <rect
                                        x={timeScale(o[timeKey]) - BAR_WIDTH / 2} 
                                        y={valueScale(o[valueKey])}
                                        width={BAR_WIDTH}
                                        height={height - valueScale(o[valueKey])}
                                        fill="steelblue"/>)}
            </g>
        );  
    
    }

}

export default BarGroup; 


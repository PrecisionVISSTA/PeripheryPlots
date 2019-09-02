import React from "react";
import { scaleTime, scaleLinear } from 'd3-scale'; 

const BAR_WIDTH = 3; 

class BarGroup extends React.Component {

    state = {
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

        let valueRange = valueScale.range(); 

        return (
            <g>
                {/* Bars */}
                {observations.map((o,i) => <rect
                                            key={i}
                                            x={timeScale(o[timeKey]) - BAR_WIDTH / 2} 
                                            y={valueScale(o[valueKey])}
                                            width={BAR_WIDTH}
                                            height={valueRange[0] - valueScale(o[valueKey])}
                                            fill="steelblue"/>)}
            </g>
        );  
    
    }

}

export default BarGroup; 


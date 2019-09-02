import React from "react";
import { scaleLinear, scaleTime } from 'd3-scale'; 

class ScatterGroup extends React.Component {

    state = {
        timeScale: scaleTime(), 
        valueScale: scaleLinear()
    }

    render() {

        let { pplot } = this.props; 
        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = pplot; 
        let { timeScale, valueScale } = this.state

        let scales = scaleRangeToBox(timeScale, valueScale); 
        timeScale = scales.xScale; 
        valueScale = scales.yScale; 

        timeScale.domain(timeDomain); 
        valueScale.domain(valueDomain); 
    
        return (
            <g>
                {/* Data Points */}
                {observations.map(o => <circle 
                                        key={`${o[timeKey]}-${o[valueKey]}`}
                                        cx={timeScale(o[timeKey])}
                                        cy={valueScale(o[valueKey])}
                                        r={1}
                                        stroke="steelblue" 
                                        strokeWidth={.5} 
                                        fill="white"/>)}
            </g>
        );  
    
    }

}

export default ScatterGroup; 


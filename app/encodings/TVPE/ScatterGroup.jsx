import React from "react";
import * as d3 from "d3"; 

class ScatterGroup extends React.Component {

    state = {
        timeScale: d3.scaleTime(), 
        valueScale: d3.scaleLinear()
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = this.props; 
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


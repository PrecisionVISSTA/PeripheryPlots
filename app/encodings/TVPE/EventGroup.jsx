import React from "react";
import * as d3 from "d3"; 

const RECT_WIDTH = 2; 
const RECT_HEIGHT = 5; 

class LineGroup extends React.Component {

    state = {
        timeScale: d3.scaleTime(), 
        valueScale: d3.scaleBand(), 
        colors: d3.schemeCategory10
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = this.props; 
        let { colors, timeScale, valueScale } = this.state

        let scales = scaleRangeToBox(timeScale, valueScale); 
        timeScale = scales.xScale; 
        valueScale = scales.yScale; 

        timeScale.domain(timeDomain); 
        valueScale.domain(valueDomain); 

        return (
            <g>
                {/* Events */}
                {observations.map(o => <rect 
                                        key={`${o[timeKey]}-${o[valueKey]}`}
                                        x={timeScale(o[timeKey])}
                                        y={valueScale(o[valueKey]) + RECT_HEIGHT / 2}
                                        width={RECT_WIDTH}
                                        height={RECT_HEIGHT}
                                        fill={colors[valueDomain.indexOf(o[valueKey])]}/>)}
            </g>
        );  
    
    }

}

export default LineGroup; 


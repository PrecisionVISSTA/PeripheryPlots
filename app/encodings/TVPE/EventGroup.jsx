import React from "react";
import { scaleTime, scaleBand } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic'; 

const RECT_WIDTH = 2; 
const RECT_HEIGHT = 5; 

class LineGroup extends React.Component {

    state = {
        timeScale: scaleTime(), 
        valueScale: scaleBand(), 
        colors: schemeCategory10
    }

    render() {

        let { pplot } = this.props; 
        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = pplot; 
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


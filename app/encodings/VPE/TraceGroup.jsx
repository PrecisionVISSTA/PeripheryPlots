import React from "react";
import * as d3 from "d3"; 

const BAR_WIDTH = 3; 
const NUM_BINS = 7; 

class TraceGroup extends React.Component {

    state = {
        valueScale: d3.scaleBand(), 
        freqScale: 
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = this.props; 
        let { line, timeScale, valueScale } = this.state

        let scales = scaleRangeToBox(valueScale, null); 
        valueScale = scales.yScale; 

        valueScale.domain(valueDomain); 


        return (
            <g>
                {/* Bars */}
                
            </g>
        );  
    
    }

}

export default TraceGroup; 


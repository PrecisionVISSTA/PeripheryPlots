import React from "react";
import * as d3 from "d3"; 

const NUM_BINS = 8; 

class QuantitativeTraceGroup extends React.Component {

    state = {
        valueScale: d3.scaleLinear(), 
        freqScale: d3.scaleLinear(), 
        histogram: d3.histogram()
    }

    render() {

        let { timeKey, valueKey, timeDomain, valueDomain, yRange, xRange, observations, scaleRangeToBox, doFlip } = this.props; 
        let { histogram, freqScale, valueScale } = this.state; 

        let scales = scaleRangeToBox(freqScale, valueScale); 
        freqScale = scales.xScale; 
        valueScale = scales.yScale; 

        freqScale.domain([0, 1.0]); 
        valueScale.domain(valueDomain); 

        let bins = histogram
                    .value(v => v[valueKey])
                    .domain(valueScale.nice().domain())
                    .thresholds(valueScale.ticks(NUM_BINS))
                    (observations); 

        bins = bins.map(bin => ({ 
            p: bin.length / observations.length, 
            y0: bin.x0, 
            y1: bin.x1
        })); 

        let binHeight = bins[0].y1 - bins[0].y0;
        
        let xWidth = xRange[1] - xRange[0]; 
        let tx = xRange[0]; 
        let ty = yRange[1]; 

        return (
            <g transform={doFlip ? `translate(${xWidth + tx},${ty}) scale(-1,1) translate(${-tx},${-ty})` : ''}>
                {/* Bars */}
                {bins.map((bin,i) => <rect
                                 key={`${i}`}
                                 x={0}
                                 y={bin.y1 + yRange[1]}
                                 width={freqScale(bin.p)}
                                 height={binHeight}
                                 fill={'steelblue'}/>)}
            </g>
        );  
    
    }

}

export default QuantitativeTraceGroup; 


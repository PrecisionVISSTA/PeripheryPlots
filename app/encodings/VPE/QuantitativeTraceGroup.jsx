import React from "react";
import * as d3 from "d3"; 

const NUM_BINS = 8; 

class QuantitativeTraceGroup extends React.Component {

    state = {
        valueScale: d3.scaleLinear(), 
        freqScale: d3.scaleLinear()
    }

    render() {

        let { pplot } = this.props; 
        let { valueKey, valueDomain, yRange, xRange, observations, scaleRangeToBox, isLeft } = pplot; 
        let { freqScale, valueScale } = this.state; 

        let scales = scaleRangeToBox(freqScale, valueScale); 
        freqScale = scales.xScale; 
        valueScale = scales.yScale; 

        freqScale.domain([0, 1.0]); 
        valueScale.domain(valueDomain); 

        let [ymax, ymin] = yRange; 
        let binHeight = (ymax - ymin) / NUM_BINS; 
        let values = observations.map(o => o[valueKey]); 
        let numValues = values.length; 
        let bins = []; 
        for (let i = 0; i < NUM_BINS; i++) {
            // Bin ranges vertically from y0 to y1
            let y0 = binHeight * i + ymin; 
            let y1 = y0 + binHeight; 
            // Figure out which values are in this bin 
            let [v1, v0] = [y0, y1].map(valueScale.invert); 
            let inds = Object.keys(values);
            let count = 0;  
            for (let key of inds) {
                if (values[key] >= v0 && values[key] <= v1) {
                    count += 1; 
                    delete values[key]; 
                }
            }
            let p = count / numValues; 
            bins.push({ p, y0 }); 
        }
        
        let xWidth = xRange[1] - xRange[0]; 
        let tx = xRange[0]; 
        let ty = yRange[1]; 

        return (
            <g transform={isLeft ? `translate(${xWidth + tx},${ty}) scale(-1,1) translate(${-tx},${-ty})` : ''}>
                {/* Bars */}
                {bins.map(({ p, y0, y1 },i) => <rect
                                                key={`${i}`}
                                                x={0}
                                                y={y0}
                                                width={freqScale(p)}
                                                height={binHeight}
                                                fill={'steelblue'}/>)}
            </g>
        );  
    
    }

}

export default QuantitativeTraceGroup; 


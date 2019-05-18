import React from "react"; 
import * as d3 from "d3"; 

const WINDOW_SIZE_MS = 86400 * 1000 * 10; 
const WINDOW_SLIDE_MS = 86400 * 1000 * 2; 
const ENVELOPE_PADDING = 0; 

class MovingAverageEnvelopeGroup extends React.Component {

    state = {
        timeScale: d3.scaleTime(), 
        valueScale: d3.scaleLinear(), 
        area: d3.area()
                .curve(d3.curveBasis)        
    }

    computeEnvelope(observations, timeKey, valueKey) {

        let dates = observations.map(d => d[timeKey]).map(d => d.valueOf()); 
        let values = observations.map(d => d[valueKey]); 
        
        let [min_ms, max_ms] = d3.extent(dates).map(d => d.valueOf()); 
        let envelope = []; 
        let wsstart = min_ms; 
        let wsend = min_ms + WINDOW_SIZE_MS; 
        
        while (wsstart < wsend) {
            let ws = wsstart; 
            let we = ws + WINDOW_SIZE_MS;
            let di = 0; 
            while (we <= max_ms) {
                while (dates[di] < ws) di++; 
                let wvalues = []; 
                while (dates[di] <= we) wvalues.push(values[di++]); 
                let date = ws + WINDOW_SIZE_MS / 2;
                if (wvalues.length > 0) {
                    let [lower, upper] = d3.extent(wvalues);
                    envelope.push({ date: new Date(date), 
                                    lower: lower * (1 - ENVELOPE_PADDING), 
                                    upper: upper * (1 + ENVELOPE_PADDING) }); 
                }
                ws += WINDOW_SIZE_MS 
                we += WINDOW_SIZE_MS; 
            }
            wsstart += WINDOW_SLIDE_MS; 
        }

        // Ensure points defining envelope are in correct order as the above 
        // loop does not construct the envelope in order 
        envelope = _.sortBy(envelope, d => d[timeKey]); 

        return envelope; 
    }

    render() {
        let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = this.props; 
        let { timeScale, valueScale, area } = this.state; 

        let scales = scaleRangeToBox(timeScale, valueScale); 
        timeScale = scales.xScale; 
        valueScale = scales.yScale; 

        timeScale.domain(timeDomain); 
        valueScale.domain(valueDomain); 

        area.x(d => timeScale(d.date))
            .y0(d => valueScale(d.lower))
            .y1(d => valueScale(d.upper)); 

        let envelope = this.computeEnvelope(observations, timeKey, valueKey); 

        return (
            <g>
                <path d={area(envelope)}/>
            </g>
        )
    }

}

export default MovingAverageEnvelopeGroup; 
import React from "react"; 
import { scaleLinear } from "d3-scale"; 
import { connect } from "react-redux"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 

const lineStyle = {
    stroke: "rgb(0, 150, 136)", 
    strokeDasharray: "1 1"
}; 

const hPadding = 3; 

class ControlToTrackAligner extends React.Component {

    state = {
        alignerScale: scaleLinear()
    }

    render() {

        let { 
            width, 
            height, 
            controlScale,
            timeDomains, 
            numContextsPerSide, 
            containerPadding, 
            focusWidth, 
            contextWidth, 
            axesWidth
        } = this.props; 

        let { alignerScale } = this.state; 

        let [cr0, cr1] = controlScale.range(); 

        alignerScale.domain(controlScale.domain()); 
        alignerScale.range([cr0 + containerPadding, cr1 - containerPadding]); 

        let topX = _.union(timeDomains.map(d => d[0]), [timeDomains[timeDomains.length-1][1]])
                    .map(controlScale); 
        let botX = _.range(0, numContextsPerSide).map(i => axesWidth + i * contextWidth); 

        // Simple algorithm for determining y coordinates 
        let yMin = hPadding; 
        let yMax = height - hPadding; 
        let dy = yMax - yMin; 
        let nYSteps = numContextsPerSide + 1; 
        let yStep = dy / nYSteps;
        let yleft = _.range(0, numContextsPerSide + 1).map(i => hPadding + i * yStep);
        let yright = _.reverse(yleft.slice()); 
        let ys = _.concat(yleft, yright); 

        botX.push(axesWidth + numContextsPerSide * contextWidth);
        botX.push(axesWidth + numContextsPerSide * contextWidth + focusWidth);
        for (let i = 0; i < numContextsPerSide; i++) {
            botX.push(axesWidth + numContextsPerSide * contextWidth + focusWidth + (i+1) * contextWidth); 
        }

        return (
            <div style={{ height }}>
                <svg style={{ width, height, paddingLeft: containerPadding, paddingRight: containerPadding }}>
                    {/* Top lines */}
                    {topX.map((x,i) => <line x1={x} x2={x} y1={0} y2={ys[i]} {...lineStyle}/>)}
                    {/* Bottom Lines */}
                    {botX.map((x,i) => <line x1={x} x2={x} y1={ys[i]} y2={height} {...lineStyle}/>)}
                    {/* Connectors */}
                    {_.range(0, topX.length).map(i => {
                        let top = topX[i]; 
                        let bot = botX[i]; 
                        return <line x1={top} x2={bot} y1={ys[i]} y2={ys[i]} {...lineStyle}/>
                    })}
                    {/* Downward Pointing Arrows */}
                    {botX.map((x,i) => {
                        let dl = 6; // the length of the line 
                        let dv = dl / Math.sqrt(2); 
                        return <g>
                            {/* line to left */}
                            <line 
                            x1={x - dv} 
                            x2={x} 
                            y1={height - 1 - dv} 
                            y2={height} 
                            {...lineStyle}/>
                            {/* line to right */}
                            <line 
                            x1={x + dv} 
                            x2={x} 
                            y1={height - 1 - dv} 
                            y2={height} 
                            {...lineStyle}/>
                        </g>
                    })}
                </svg>
            </div>
            
        )
    }
}

const mapStateToProps = ({ 
                            timeDomains, 
                            numContextsPerSide, 
                            timeExtentDomain, 
                            containerPadding, 
                            axesWidth, 
                            focusWidth, 
                            contextWidth, 
                            contextWidthRatio
                        }) => 
                        ({ 
                            timeDomains, 
                            numContextsPerSide, 
                            timeExtentDomain, 
                            containerPadding,  
                            axesWidth, 
                            focusWidth, 
                            contextWidth, 
                            contextWidthRatio
                        }); 

export default connect(mapStateToProps, null, null, { context: PeripheryPlotContext })(ControlToTrackAligner); 
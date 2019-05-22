import React from "react"; 
import { connect } from "react-redux"; 
import * as d3 from "d3"; 


class VistaVerticalAligner extends React.Component {

    state = {
        scale: d3.scaleLinear(), 
        otherScale: d3.scaleLinear()
    }

    render() {
        let { timeDomains, width, height, numContextsPerSide, timeExtentDomain } = this.props; 
        let { scale, otherScale } = this.state; 

        // Move to redux store 
        let axesWidth = 40; 
        let focusWidth = 460; 
        let contextWidth = 100; 
        let padding = 3; 

        otherScale.domain(timeExtentDomain).range([12, 700 - 12]); 

        let topX = _.union(timeDomains.map(d => d[0]), [timeDomains[timeDomains.length-1][1]]).map(otherScale).map(v => v + 3); 
        let botX = []; 
        let ys = [height/3, height/2, height/2, height/3]; 

        for (let i = 0; i < numContextsPerSide; i++) {
            botX.push(axesWidth + padding + i * contextWidth); 
        }
        botX.push(axesWidth + padding + numContextsPerSide * contextWidth);
        botX.push(axesWidth + padding + numContextsPerSide * contextWidth + focusWidth);
        for (let i = 0; i < numContextsPerSide; i++) {
            botX.push(axesWidth + padding + numContextsPerSide * contextWidth + focusWidth + (i+1) * contextWidth); 
        }

        return (
            <svg style={{ width, height }}>
                {/* Top lines */}
                {topX.map((x,i) => <line x1={x} x2={x} y1={0} y2={ys[i]} stroke="rgb(0, 150, 136)" strokeDasharray="1 1"/>)}
                {/* Bottom Lines */}
                {botX.map((x,i) => <line x1={x} x2={x} y1={ys[i]} y2={height} stroke="rgb(0, 150, 136)" strokeDasharray="1 1"/>)}
                {/* Connectors */}
                {_.range(0, topX.length).map(i => {
                    let top = topX[i]; 
                    let bot = botX[i]; 
                    return <line x1={top} x2={bot} y1={ys[i]} y2={ys[i]} stroke="rgb(0, 150, 136)" strokeDasharray="1 1"/>
                })}
            </svg>
        )
    }
}

const mapStateToProps = ({ timeDomains, numContextsPerSide, timeExtentDomain }) => 
                        ({ timeDomains, numContextsPerSide, timeExtentDomain }); 

export default connect(mapStateToProps, null)(VistaVerticalAligner); 
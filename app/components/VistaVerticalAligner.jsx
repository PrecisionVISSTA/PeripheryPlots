import React from "react"; 
import { connect } from "react-redux"; 

const lineStyle = {
    stroke: "rgb(0, 150, 136)", 
    strokeDasharray: "1 1"
}

class VistaVerticalAligner extends React.Component {

    render() {
        let { 
            width, 
            height, 
            controlScale,
            timeDomains, 
            numContextsPerSide, 
            padding, 
            axesWidth, 
            focusWidth, 
            contextWidth 
        } = this.props; 

        let topX = _.union(timeDomains.map(d => d[0]), [timeDomains[timeDomains.length-1][1]])
                    .map(controlScale); 
        let botX = []; 
        let ys = [height/4, height/1.5, height/1.5, height/4]; 

        for (let i = 0; i < numContextsPerSide; i++) {
            botX.push(axesWidth + i * contextWidth); 
        }
        botX.push(axesWidth + numContextsPerSide * contextWidth);
        botX.push(axesWidth + numContextsPerSide * contextWidth + focusWidth);
        for (let i = 0; i < numContextsPerSide; i++) {
            botX.push(axesWidth + numContextsPerSide * contextWidth + focusWidth + (i+1) * contextWidth); 
        }

        return (
            <div style={{ height }}>
                <svg style={{ width, height, paddingLeft: padding, paddingRight: padding }}>
                    {/* Top lines */}
                    {topX.map((x,i) => <line x1={x} x2={x} y1={0} y2={ys[i]} {...lineStyle}/>)}
                    {/* Bottom Lines */}
                    {botX.map((x,i) => <line x1={x} x2={x} y1={ys[i]} y2={height+1} {...lineStyle}/>)}
                    {/* Connectors */}
                    {_.range(0, topX.length).map(i => {
                        let top = topX[i]; 
                        let bot = botX[i]; 
                        return <line x1={top} x2={bot} y1={ys[i]} y2={ys[i]} {...lineStyle}/>
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
                            padding, 
                            axesWidth, 
                            focusWidth, 
                            contextWidth 
                        }) => 
                        ({ 
                            timeDomains, 
                            numContextsPerSide, 
                            timeExtentDomain, 
                            padding,  
                            axesWidth, 
                            focusWidth, 
                            contextWidth 
                        }); 

export default connect(mapStateToProps, null)(VistaVerticalAligner); 
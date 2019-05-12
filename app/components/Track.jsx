import React from "react"; 
import { connect } from "react-redux";
import { zip } from "../util/util";  

const HEIGHT = 50; 
const WIDTH = 700; 
const CONTEXT_WIDTH = 100; 

class Track extends React.Component {

    render() {
        let { timeDomains, numContextsPerSide } = this.props; 
        let leftContextTimeDomains = timeDomains.slice(0, numContextsPerSide);
        let focusTimeDomain = timeDomains[numContextsPerSide]; 
        let rightContextTimeDomains = timeDomains.slice(numContextsPerSide + 1, timeDomains.length); 
        let focusWidth = WIDTH - CONTEXT_WIDTH * 2 * numContextsPerSide;
        return (
        <div
        style={{ width: WIDTH, height: HEIGHT }}>
            {/* Left Contexts */}
            {leftContextTimeDomains.map(timeDomain => (
                <svg
                style={{ width: CONTEXT_WIDTH, height: HEIGHT }}
                timeDomain={timeDomain}>

                </svg>
            ))}
            {/* Focus */}
            <svg
            style={{ width: focusWidth }}
            timeDomain={focusTimeDomain}>

            </svg>
            {/* Right Contexts */}
            {rightContextTimeDomains.map(timeDomain => (
                <svg
                style={{ width: CONTEXT_WIDTH, height: HEIGHT }}
                timeDomain={timeDomain}>

                </svg>
            ))}
        </div>
        )
    }

}

const mapStateToProps = ({ timeDomains, numContextsPerSide }) => ({ timeDomains, numContextsPerSide }); 

export default connect(mapStateToProps, null)(Track); 
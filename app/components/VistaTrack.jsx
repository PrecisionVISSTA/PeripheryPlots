import React from "react"; 
import { connect } from "react-redux";
import { zip, scaleRangeToBox } from "../util/util";  

class VistaTrack extends React.Component {

    state = {
        height: 50, 
        width: 750, 
        contextWidth: 100
    }

    render() {

        let { 
            observations, 
            timeKey, 
            valueKey, 
            timeDomains, 
            numContextsPerSide, 
            encodings 
        } = this.props; 
        let { width, height, contextWidth } = this.state; 

        // utility functions 
        let valueInDomain = (value, domain) => value >= domain[0] && value <= domain[1]; 
        let observationsInDomain = domain => observations.filter(o => valueInDomain(o[timeKey], domain)); 

        // partitioned domains 
        let leftContextTimeDomains = timeDomains.slice(0, numContextsPerSide);
        let focusTimeDomain = timeDomains[numContextsPerSide]; 
        let rightContextTimeDomains = timeDomains.slice(numContextsPerSide + 1, timeDomains.length);
        
        // partitioned encodings
        let leftContextEncodings = encodings.slice(0, numContextsPerSide); 
        let FocusEncoding = encodings[numContextsPerSide]; 
        let rightContextEncodings = encodings.slice(numContextsPerSide + 1, encodings.length); 

        // partitioned observations
        let leftContextObservations = leftContextTimeDomains.map(observationsInDomain);
        let focusObservations = observationsInDomain(focusTimeDomain); 
        let rightContextObservations = rightContextTimeDomains.map(observationsInDomain); 

        // Derived properties 
        let focusWidth = width - contextWidth * 2 * numContextsPerSide;
        let valueDomain = extent(observations.map(o => o[valueKey])); 
        let contextScaleRangeToBox = _.partial(scaleRangeToBox, [0, contextWidth], [height, 0]); 
        let focusScaleRangeToBox = _.partial(scaleRangeToBox, [0, focusWidth], [height, 0])

        return (
        <div style={{ width: width, height: height }}>

            {/* Left Contexts */}
            {leftContextTimeDomains.map((timeDomain, i) => (
                <svg style={{ width: contextWidth, height: height }}>
                    {leftContextEncodings[i].map(LeftContextEncoding => 
                        <LeftContextEncoding
                        timeKey={timeKey}
                        valueKey={valueKey}
                        timeDomain={timeDomain}
                        valueDomain={valueDomain}
                        observations={leftContextObservations[i]}
                        scaleRangeToBox={contextScaleRangeToBox}/>
                    )}
                </svg>
            ))}

            {/* Focus */}
            <svg style={{ width: focuswidth }}>
                <FocusEncoding
                timeKey={timeKey}
                valueKey={valueKey}
                timeDomain={focusTimeDomain}
                valueDomain={valueDomain}
                observations={focusObservations}
                scaleRangeToBox={focusScaleRangeToBox}/>
            </svg>

            {/* Right Contexts */}
            {rightContextTimeDomains.map((timeDomain, i) => (
                <svg style={{ width: contextWidth, height: height }}>
                    {rightContextEncodings[i].map(RightContextEncoding => 
                        <RightContextEncoding
                        timeKey={timeKey}
                        valueKey={valueKey}
                        timeDomain={timeDomain}
                        valueDomain={valueDomain}
                        observations={rightContextObservations[i]}
                        scaleRangeToBox={contextScaleRangeToBox}/>
                    )}
                </svg>
            ))}
        </div>
        );
    }

}

const mapStateToProps = ({ timeDomains, numContextsPerSide }) => ({ timeDomains, numContextsPerSide }); 

export default connect(mapStateToProps, null)(VistaTrack); 
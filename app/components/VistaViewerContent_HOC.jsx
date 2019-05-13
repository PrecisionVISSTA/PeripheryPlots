import React from "react";
import { connect } from "react-redux"; 
import _ from "lodash"; 

import { ACTION_CHANGE_timeDomains, ACTION_CHANGE_timeExtentDomain } from "../actions/actions"; 

import VistaTimelineControl from "./VistaTimelineControl.jsx"; 
import VistaTrack from "./VistaTrack.jsx"; 

export default function VistaViewerContentHOC(config) {

    class VistaViewerContent extends React.Component {

        state = {
            firstRender: true 
        }

        getDefaultParametersIfNotSpecified(props) {
    
            let {
                numContextsPerSide, 
                controlTimelineWidth, 
                controlTimelineHeight, 
                trackWidth, 
                trackHeight, 
                contextWidth
            } = props; 
    
            if (!numContextsPerSide) numContextsPerSide = 1; 
            if (!controlTimelineHeight) controlTimelineHeight = 50;
            if (!controlTimelineWidth) controlTimelineWidth = 500; 
            if (!trackHeight) trackHeight = 50; 
            if (!trackWidth) trackWidth = 500; 
            if (!contextWidth) contextWidth = 100; 
    
            return {
                numContextsPerSide, 
                controlTimelineWidth, 
                controlTimelineHeight, 
                trackWidth, 
                trackHeight, 
                contextWidth
            };
        }
    
        componentDidMount() {
            // Update the global store with the properties passed in initially 
            this.props.ACTION_CHANGE_timeDomains(config.timeDomains); 
            this.props.ACTION_CHANGE_timeExtentDomain(config.timeExtentDomain); 
            this.setState({ firstRender: false }); 
        }
    
        render() {

            if (this.state.firstRender) return null; 

            let { timeDomains } = this.props;
            let {   trackwiseObservations,
                    trackwiseTimeKeys, 
                    trackwiseValueKeys, 
                    trackwiseEncodings } = config; 

            let {
                numContextsPerSide, 
                controlTimelineWidth, 
                controlTimelineHeight, 
                trackWidth, 
                trackHeight, 
                contextWidth 
            } = this.getDefaultParametersIfNotSpecified({}); 
    
            let numTracks = trackwiseObservations.length; 
    
            return (
                <React.Fragment>
                    {/* 
                    Timeline that allows user to change selected time domains for focus / context areas 
                    Changes that occur in this component are propagated to the global store, which triggers
                    view changes for all linked tracks 
                    */}
                    <VistaTimelineControl
                    width={trackWidth}
                    height={trackHeight}/>
                    {/* 
                    Time series tracks 
                    */}
                    {_.range(0, numTracks).map(i => {
                        let observations = trackwiseObservations[i]; 
                        let timeKey = trackwiseTimeKeys[i]; 
                        let valueKey = trackwiseValueKeys[i]; 
                        let encodings = trackwiseEncodings[i]; 
                        return <VistaTrack
                                key={`track-${i}`}
                                observations={observations} 
                                timeKey={timeKey} 
                                valueKey={valueKey}
                                timeDomains={timeDomains} 
                                numContextsPerSide={numContextsPerSide}
                                encodings={encodings}/>; 
                    })}
                </React.Fragment>
            );
        }
    
    }
    
    const mapStateToProps = ({ 
                                timeExtentDomain, 
                                timeDomains
                            }) => 
                            ({ 
                                timeExtentDomain, 
                                timeDomains
                            });
    
    const mapDispatchToProps = dispatch => ({
    
        ACTION_CHANGE_timeDomains: (timeDomains) => 
            dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 
    
        ACTION_CHANGE_timeExtentDomain: (timeExtentDomain) => 
            dispatch(ACTION_CHANGE_timeExtentDomain(timeExtentDomain)) 
    
    }); 
    
    return connect(mapStateToProps, mapDispatchToProps)(VistaViewerContent); 

}



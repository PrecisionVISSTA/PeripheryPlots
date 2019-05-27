import React from "react";
import { connect } from "react-redux"; 
import _ from "lodash"; 

import { ACTION_CHANGE_timeDomains, ACTION_CHANGE_timeExtentDomain } from "../actions/actions"; 

import VistaTimelineControl from "./VistaTimelineControl.jsx"; 
import VistaTrack from "./VistaTrack.jsx"; 
import VistaVerticalAligner from "./VistaVerticalAligner.jsx"; 

export default function VistaViewerContentHOC(config) {

    class VistaViewerContent extends React.Component {

        state = {
            firstRender: true
        }
    
        componentDidMount() {
            // Initial state determined at runtime 
            this.props.ACTION_CHANGE_timeDomains(config.timeDomains); 
            this.props.ACTION_CHANGE_timeExtentDomain(config.timeExtentDomain);  

            // After mounting, we allow the component to render 
            this.setState({ firstRender: false });
        }
    
        render() {

            // Do not render anything initially, we must first update global store with configuration properties 
            // as specified by the user. Once we can access these properties in the store, we render the component
            if (this.state.firstRender) {
                return null; 
            }

            let {   numContextsPerSide, 
                    axesWidth, 
                    contextWidth, 
                    trackWidth, 
                    controlTimelineHeight, 
                    controlTimelineWidth, 
                    trackHeight, 
                    trackPaddingTop, 
                    trackPaddingBottom, 
                    focusWidth, 
                    verticalAlignerHeight
                } = this.props;

            let {   trackwiseObservations,
                    trackwiseTimeKeys, 
                    trackwiseValueKeys, 
                    trackwiseEncodings } = config; 

            let numTracks = trackwiseObservations.length; 

            let ids = _.range(0, numTracks).map(i => `track-${i}`); 
    
            return (
                <React.Fragment>
                    {/* 
                    Timeline that allows user to change selected time domains for focus / context areas 
                    Changes that occur in this component are propagated to the global store, which triggers
                    view changes for all linked tracks 
                    */}
                    <VistaTimelineControl
                    width={controlTimelineWidth}
                    height={controlTimelineHeight}/>

                    <VistaVerticalAligner
                    width={708}
                    height={verticalAlignerHeight}/>

                    {/* 
                    Time series tracks 
                    */}
                    {_.range(0, numTracks).map(i => {
                        let observations = trackwiseObservations[i]; 
                        let timeKey = trackwiseTimeKeys[i]; 
                        let valueKey = trackwiseValueKeys[i]; 
                        let encodings = trackwiseEncodings[i]; 
                        return (
                            <div style={{ border: '1px solid grey', width: trackWidth, }}>
                                <VistaTrack
                                id={ids[i]}
                                key={`track-${i}`}
                                observations={observations} 
                                timeKey={timeKey} 
                                valueKey={valueKey}
                                numContextsPerSide={numContextsPerSide}
                                encodings={encodings}
                                trackWidth={trackWidth}
                                trackHeight={trackHeight}
                                trackPaddingTop={trackPaddingTop}
                                trackPaddingBottom={trackPaddingBottom}
                                focusWidth={focusWidth}
                                contextWidth={contextWidth}
                                axesWidth={axesWidth}/>
                            </div>
                        ); 
                    })}
                </React.Fragment>
            );
        }
    
    }

    const mapStateToProps = ({
                                numContextsPerSide, 
                                axesWidth, 
                                contextWidth, 
                                trackWidth, 
                                controlTimelineHeight, 
                                controlTimelineWidth, 
                                trackHeight, 
                                trackPaddingTop, 
                                trackPaddingBottom, 
                                focusWidth, 
                                verticalAlignerHeight
                            }) => 
                            ({
                                numContextsPerSide, 
                                axesWidth, 
                                contextWidth, 
                                trackWidth, 
                                controlTimelineHeight, 
                                controlTimelineWidth, 
                                trackHeight, 
                                trackPaddingTop, 
                                trackPaddingBottom, 
                                focusWidth, 
                                verticalAlignerHeight
                            }); 
    
    const mapDispatchToProps = dispatch => ({
    
        ACTION_CHANGE_timeDomains: (timeDomains) => 
            dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 
    
        ACTION_CHANGE_timeExtentDomain: (timeExtentDomain) => 
            dispatch(ACTION_CHANGE_timeExtentDomain(timeExtentDomain)) 
    
    }); 
    
    return connect(mapStateToProps, mapDispatchToProps)(VistaViewerContent); 

}



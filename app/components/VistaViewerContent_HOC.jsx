import React from "react";
import { connect } from "react-redux"; 
import _ from "lodash"; 
import * as d3 from "d3"; 

import { ACTION_CHANGE_timeDomains, ACTION_CHANGE_timeExtentDomain } from "../actions/actions"; 

import VistaTimelineControl from "./VistaTimelineControl.jsx"; 
import VistaTrack from "./VistaTrack.jsx"; 
import VistaVerticalAligner from "./VistaVerticalAligner.jsx"; 

export default function VistaViewerContentHOC(config) {

    class VistaViewerContent extends React.Component {

        state = {
            firstRender: true, 
            zooms: []
        }

        getDefaultParametersIfNotSpecified(props) {
    
            let {
                numContextsPerSide, 
                controlTimelineWidth, 
                controlTimelineHeight, 
                trackWidth, 
                trackHeight, 
                trackPaddingTop, 
                trackPaddingBottom, 
                contextWidth, 
                axesWidth, 
            } = props; 
    
            if (!numContextsPerSide) numContextsPerSide = 1; 
            if (!controlTimelineHeight) controlTimelineHeight = 75;
            if (!controlTimelineWidth) controlTimelineWidth = 700; 
            if (!trackHeight) trackHeight = 60; 
            if (!trackWidth) trackWidth = 700; 
            if (!trackPaddingTop) trackPaddingTop = 5; 
            if (!trackPaddingBottom) trackPaddingBottom = 5; 
            if (!contextWidth) contextWidth = 100; 
            if (!axesWidth) axesWidth = 40; 
    
            return {
                numContextsPerSide, 
                controlTimelineWidth, 
                controlTimelineHeight, 
                trackWidth, 
                trackHeight, 
                trackPaddingTop, 
                trackPaddingBottom, 
                contextWidth, 
                axesWidth
            };
        }
    
        componentDidMount() {
            // Update the global store with the properties passed in initially 
            this.props.ACTION_CHANGE_timeDomains(config.timeDomains); 
            this.props.ACTION_CHANGE_timeExtentDomain(config.timeExtentDomain); 

            let nZooms = this.props.numContextsPerSide * 2 + 1; 
            this.setState({ 
                firstRender: false, 
                zooms: _.range(0, nZooms).map(i => d3.zoom()) 
            }); 
        }
    
        render() {

            if (this.state.firstRender) return null; 

            let { zooms } = this.state; 
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
                trackPaddingTop, 
                trackPaddingBottom, 
                contextWidth, 
                axesWidth
            } = this.getDefaultParametersIfNotSpecified({}); 
    
            let numTracks = trackwiseObservations.length; 
            let focusWidth = trackWidth - contextWidth * 2 * numContextsPerSide - axesWidth;
    
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
                    height={30}/>


                    {/* 
                    Time series tracks 
                    */}
                    {_.range(0, numTracks).map(i => {
                        let observations = trackwiseObservations[i]; 
                        let timeKey = trackwiseTimeKeys[i]; 
                        let valueKey = trackwiseValueKeys[i]; 
                        let encodings = trackwiseEncodings[i]; 
                        return (
                            <div 
                            style={{ 
                                border: '1px solid grey',
                                width: trackWidth, 
                                marginBottom: 8, 
                                padding: 3
                            }}>
                                <VistaTrack
                                key={`track-${i}`}
                                observations={observations} 
                                timeKey={timeKey} 
                                valueKey={valueKey}
                                timeDomains={timeDomains} 
                                numContextsPerSide={numContextsPerSide}
                                encodings={encodings}
                                trackWidth={trackWidth}
                                trackHeight={trackHeight}
                                trackPaddingTop={trackPaddingTop}
                                trackPaddingBottom={trackPaddingBottom}
                                focusWidth={focusWidth}
                                contextWidth={contextWidth}
                                axesWidth={axesWidth}
                                zooms={zooms}/>
                            </div>
                        ); 
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



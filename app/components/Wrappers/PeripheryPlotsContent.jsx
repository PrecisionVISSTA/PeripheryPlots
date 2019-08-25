import React, { useState, useEffect } from "react";
import * as d3 from "d3"; 
import useDimensions from "react-use-dimensions";
import { connect } from "react-redux"; 
import _ from "lodash"; 

import {    ACTION_CHANGE_timeDomains, 
            ACTION_CHANGE_timeExtentDomain, 
            ACTION_CHANGE_baseWidth, 
            ACTION_CHANGE_contextWidthRatio, 
            ACTION_CHANGE_numContextsPerSide } from "../../actions/actions"; 

import TimelineControl from "../ControlTimeline/TimelineControl.jsx"; 
import Track from "../Tracks/Track.jsx"; 
import ControlToTrackAligner from "../Aligner/ControlToTrackAligner.jsx";

function PeripheryPlotsContent(props) {

    let {   
        config, 
        baseWidth, 
        controlTimelineHeight, 
        verticalAlignerHeight } = props;

    let {   
        trackwiseObservations,
        trackwiseUnits, 
        trackwiseTimeKeys, 
        trackwiseValueKeys, 
        trackwiseEncodings, 
        contextWidthRatio, 
        numContextsPerSide } = config;

    const [controlScale, setControlScale] = useState(() => d3.scaleTime()); 
    const [ref, { width }] = useDimensions();

    useEffect(() => {

        // Update global store with values from user configuration object 
        props.ACTION_CHANGE_timeDomains(config.timeDomains); 
        props.ACTION_CHANGE_timeExtentDomain(config.timeExtentDomain);  
        props.ACTION_CHANGE_contextWidthRatio(config.contextWidthRatio); 
        props.ACTION_CHANGE_numContextsPerSide(config.numContextsPerSide); 

    }, []); 

    useEffect(() => {

        // When we are able to measure dimensions of parent container, update global store 
        if (!isNaN(width)) {
            props.ACTION_CHANGE_baseWidth(width); 
            setControlScale(scale => scale.domain(config.timeExtentDomain)
                                          .range([0, width])); 
            
        }
        
    }, [width]); 

    let doRender = controlScale.range()[1] > 0 && baseWidth > 0; 

    return (
    <div ref={ref} style={{ width: '100%' }}>
        {doRender ? 
            <React.Fragment>

                <TimelineControl
                controlScale={controlScale}
                width={baseWidth}
                height={controlTimelineHeight}/>    

                <ControlToTrackAligner
                controlScale={controlScale}
                width={baseWidth}
                height={verticalAlignerHeight}/>

                {_.range(0, trackwiseObservations.length).map(i => {
                    let observations = trackwiseObservations[i]; 
                    let timeKey = trackwiseTimeKeys[i]; 
                    let valueKey = trackwiseValueKeys[i]; 
                    let encodings = trackwiseEncodings[i]; 
                    let unit = trackwiseUnits[i]; 
                    return (
                        <Track
                        controlScale={controlScale}
                        id={`track-${i}`}
                        key={`track-${i}`}
                        title={valueKey}
                        unit={unit}
                        observations={observations} 
                        timeKey={timeKey} 
                        valueKey={valueKey}
                        encodings={encodings}/>
                    ); 
                })}

            </React.Fragment>
            
            : null
        }
    </div>
    ); 

}

const mapStateToProps = ({ 
    controlTimelineHeight, 
    baseWidth, 
    verticalAlignerHeight
}) => 
({
    controlTimelineHeight, 
    baseWidth, 
    verticalAlignerHeight
}); 

const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_timeDomains: (timeDomains) => 
    dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 

    ACTION_CHANGE_timeExtentDomain: (timeExtentDomain) => 
    dispatch(ACTION_CHANGE_timeExtentDomain(timeExtentDomain)), 

    ACTION_CHANGE_baseWidth: (baseWidth) => 
    dispatch(ACTION_CHANGE_baseWidth(baseWidth)), 

    ACTION_CHANGE_contextWidthRatio: (contextWidthRatio) => 
    dispatch(ACTION_CHANGE_contextWidthRatio(contextWidthRatio)), 

    ACTION_CHANGE_numContextsPerSide: (numContextsPerSide) => 
    dispatch(ACTION_CHANGE_numContextsPerSide(numContextsPerSide))

}); 

export default connect(mapStateToProps, mapDispatchToProps)(PeripheryPlotsContent);


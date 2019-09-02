import React, { useState, useEffect } from "react";
import { scaleTime } from 'd3-scale';  
import useDimensions from "react-use-dimensions";
import { connect } from "react-redux"; 
import _ from "lodash"; 

import {    ACTION_CHANGE_timeDomains, 
            ACTION_CHANGE_timeExtentDomain, 
            ACTION_CHANGE_baseWidth, 
            ACTION_CHANGE_contextWidthRatio, 
            ACTION_CHANGE_numContextsPerSide,
            ACTION_CHANGE_containerPadding, 
            ACTION_CHANGE_controlTimelineHeight, 
            ACTION_CHANGE_verticalAlignerHeight, 
            ACTION_CHANGE_axesWidth, 
            ACTION_CHANGE_trackHeight, 
            ACTION_CHANGE_trackSvgOffsetTop, 
            ACTION_CHANGE_trackSvgOffsetBottom, 
            ACTION_CHANGE_tickInterval, 
            ACTION_CHANGE_focusColor, 
            ACTION_CHANGE_contextColor, 
            ACTION_CHANGE_lockActiveColor, 
            ACTION_CHANGE_lockInactiveColor, 
            ACTION_CHANGE_dZoom, 
            ACTION_CHANGE_applyContextEncodingsUniformly, 
            ACTION_CHANGE_formatTrackHeader

        } from "../../actions/actions"; 

import TimelineControl from "../ControlTimeline/TimelineControl"; 
import Track from "../Tracks/Track"; 
import ControlToTrackAligner from "../Aligner/ControlToTrackAligner";

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
        trackwiseTypes, 
        trackwiseNumAxisTicks,
        trackwiseAxisTickFormatters
    } = config;

    const [controlScale, setControlScale] = useState(() => scaleTime()); 
    const [ref, { width }] = useDimensions();

    useEffect(() => {

        // When we are able to measure dimensions of parent container, update global store 
        if (!isNaN(width)) {
            props.ACTION_CHANGE_baseWidth(width); 
            setControlScale(scale => scale.domain(config.timeExtentDomain)
                                          .range([0, width])); 
            
        }
        
    }, [width]); 

    // Update store with these properties anytime config changes 
    useEffect(() => {

        const updateProps = [
            'containerPadding', 
            'controlTimelineHeight', 
            'verticalAlignerHeight', 
            'axesWidth', 
            'trackHeight', 
            'trackSvgOffsetTop', 
            'trackSvgOffsetBottom', 
            'focusColor', 
            'contextColor', 
            'lockActiveColor', 
            'lockInactiveColor', 
            'dZoom', 
            'timeDomains', 
            'timeExtentDomain', 
            'contextWidthRatio', 
            'numContextsPerSide', 
            'tickInterval', 
            'applyContextEncodingsUniformly', 
            'formatTrackHeader'
        ]; 

        for (let p of updateProps) {
            if (config[p] !== undefined) {
                props[`ACTION_CHANGE_${p}`](config[p]); 
            }
        }

    }, [config]); 

    let doRender = controlScale.range()[1] > 0 && baseWidth > 0; 
    let containerBackgroundColor = config.containerBackgroundColor === undefined ? '#fff' : config.containerBackgroundColor; 

    return (
    <div ref={ref} style={{ width: '100%', backgroundColor: containerBackgroundColor }}>
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
                    let type = trackwiseTypes[i];  
                    let unit = trackwiseUnits[i]; 
                    let numAxisTicks = trackwiseNumAxisTicks ? trackwiseNumAxisTicks[i] : null; 
                    let axisTickFormatter = trackwiseAxisTickFormatters ? trackwiseAxisTickFormatters[i] : null; 
                    return (
                        <Track
                        controlScale={controlScale}
                        id={`track-${i}`}
                        key={`track-${i}`}
                        type={type}
                        unit={unit}
                        numAxisTicks={numAxisTicks}
                        axisTickFormatter={axisTickFormatter}
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
    dispatch(ACTION_CHANGE_numContextsPerSide(numContextsPerSide)),

    ACTION_CHANGE_containerPadding: (containerPadding) => 
    dispatch(ACTION_CHANGE_containerPadding(containerPadding)), 

    ACTION_CHANGE_controlTimelineHeight: (controlTimelineHeight) => 
    dispatch(ACTION_CHANGE_controlTimelineHeight(controlTimelineHeight)), 

    ACTION_CHANGE_verticalAlignerHeight: (verticalAlignerHeight) => 
    dispatch(ACTION_CHANGE_verticalAlignerHeight(verticalAlignerHeight)), 

    ACTION_CHANGE_axesWidth: (axesWidth) => 
    dispatch(ACTION_CHANGE_axesWidth(axesWidth)), 

    ACTION_CHANGE_trackHeight: (trackHeight) => 
    dispatch(ACTION_CHANGE_trackHeight(trackHeight)), 

    ACTION_CHANGE_trackSvgOffsetTop: (trackSvgOffsetTop) => 
    dispatch(ACTION_CHANGE_trackSvgOffsetTop(trackSvgOffsetTop)), 

    ACTION_CHANGE_trackSvgOffsetBottom: (trackSvgOffsetBottom) => 
    dispatch(ACTION_CHANGE_trackSvgOffsetBottom(trackSvgOffsetBottom)), 

    ACTION_CHANGE_tickInterval: (tickInterval) => 
    dispatch(ACTION_CHANGE_tickInterval(tickInterval)),

    ACTION_CHANGE_focusColor: (focusColor) => 
    dispatch(ACTION_CHANGE_focusColor(focusColor)),

    ACTION_CHANGE_contextColor: (contextColor) => 
    dispatch(ACTION_CHANGE_contextColor(contextColor)),

    ACTION_CHANGE_lockActiveColor: (lockActiveColor) => 
    dispatch(ACTION_CHANGE_lockActiveColor(lockActiveColor)),

    ACTION_CHANGE_lockInactiveColor: (lockInactiveColor) => 
    dispatch(ACTION_CHANGE_lockInactiveColor(lockInactiveColor)),

    ACTION_CHANGE_dZoom: (dZoom) => 
    dispatch(ACTION_CHANGE_dZoom(dZoom)),    

    ACTION_CHANGE_applyContextEncodingsUniformly: (applyContextEncodingsUniformly) => 
    dispatch(ACTION_CHANGE_applyContextEncodingsUniformly(applyContextEncodingsUniformly)),

    ACTION_CHANGE_formatTrackHeader: (formatTrackHeader) => 
    dispatch(ACTION_CHANGE_formatTrackHeader(formatTrackHeader)),

}); 

export default connect(mapStateToProps, mapDispatchToProps)(PeripheryPlotsContent);


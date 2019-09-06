import TimelineControl from "../ControlTimeline/TimelineControl"; 
import Track from "../Tracks/Track"; 
import ControlToTrackAligner from "../Aligner/ControlToTrackAligner";
import React from "react"; 

export function getControlTimeline(props) {
    let { controlTimelineHeight, controlScale, baseWidth } = props;
    return (
        <TimelineControl
        controlScale={controlScale}
        width={baseWidth}
        height={controlTimelineHeight}/>  
    ); 
}

export function getControlAligner(props) {
    let { controlScale, baseWidth, verticalAlignerHeight } = props; 
    return (
        <ControlToTrackAligner
        controlScale={controlScale}
        width={baseWidth}
        height={verticalAlignerHeight}/>
    );
}

export function getTrack(props, i) {

    let { config, controlScale } = props; 
    let {   
        trackwiseObservations,
        trackwiseUnits, 
        trackwiseTimeKeys, 
        trackwiseValueKeys, 
        trackwiseEncodings, 
        trackwiseTypes, 
        trackwiseNumAxisTicks,
        trackwiseAxisTickFormatters } = config;

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

}
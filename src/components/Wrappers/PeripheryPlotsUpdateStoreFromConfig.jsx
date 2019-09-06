import { useEffect } from "react";
import { connect } from "react-redux"; 
import _ from "lodash"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 

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
            ACTION_CHANGE_formatTrackHeader, 
            ACTION_CHANGE_msecsPadding, 
            ACTION_CHANGE_handleOutlineColor, 
            ACTION_CHANGE_brushOutlineColor, 
            ACTION_CHANGE_lockOutlineColor

        } from "../../actions/actions"; 

function PeripheryPlotsUpdateStoreFromConfig(props) {

    let { config } = props;

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
            'formatTrackHeader', 
            'msecsPadding', 
            'lockOutlineColor', 
            'handleOutlineColor', 
            'brushOutlineColor'
        ]; 

        for (let p of updateProps) {
            if (config[p] !== undefined) {
                props[`ACTION_CHANGE_${p}`](config[p]); 
            }
        }

    }, [config]); 

    return null; 

};

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

    ACTION_CHANGE_msecsPadding: (msecsPadding) => 
    dispatch(ACTION_CHANGE_msecsPadding(msecsPadding)),

    ACTION_CHANGE_handleOutlineColor: (handleOutlineColor) => 
    dispatch(ACTION_CHANGE_handleOutlineColor(handleOutlineColor)),

    ACTION_CHANGE_brushOutlineColor: (brushOutlineColor) => 
    dispatch(ACTION_CHANGE_brushOutlineColor(brushOutlineColor)),

    ACTION_CHANGE_lockOutlineColor: (lockOutlineColor) => 
    dispatch(ACTION_CHANGE_lockOutlineColor(lockOutlineColor)),

}); 

export default connect(null, mapDispatchToProps, null, { context: PeripheryPlotContext })(PeripheryPlotsUpdateStoreFromConfig);


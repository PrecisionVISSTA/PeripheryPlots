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
            ACTION_CHANGE_lockOutlineColor, 
            ACTION_CHANGE_storeInit, 

            ACTION_CHANGE_trackwiseEncodings, 
            ACTION_CHANGE_trackwiseAxisTickFormatters, 
            ACTION_CHANGE_trackwiseNumAxisTicks, 
            ACTION_CHANGE_trackwiseObservations, 
            ACTION_CHANGE_trackwiseTimeKeys,
            ACTION_CHANGE_trackwiseTypes, 
            ACTION_CHANGE_trackwiseUnits,
            ACTION_CHANGE_trackwiseValueKeys

        } from "../../actions/actions"; 

function PeripheryPlotsUpdateStoreFromConfiguration(props) {

    const { controlScale, config } = props; 

    /*
    SINGLE TIME UPDATE FOR ALL CONFIGURATION PROPERTIES 
    */ 
    useEffect(() => {

        let properties = [
            "timeDomains",
            "timeExtentDomain",
            "contextWidthRatio",
            "numContextsPerSide",
            "containerPadding",
            "controlTimelineHeight",
            "verticalAlignerHeight",
            "axesWidth",
            "trackHeight",
            "trackSvgOffsetTop",
            "trackSvgOffsetBottom",
            "tickInterval",
            "focusColor",
            "contextColor",
            "lockActiveColor",
            "lockInactiveColor",
            "dZoom",
            "applyContextEncodingsUniformly",
            "formatTrackHeader",
            "msecsPadding",
            "handleOutlineColor",
            "brushOutlineColor",
            "lockOutlineColor",

            "trackwiseObservations", 
            "trackwiseEncodings", 
            "trackwiseTimeKeys",
            "trackwiseValueKeys",
            "trackwiseTypes", 
            "trackwiseUnits", 
            "trackwiseNumAxisTicks", 
            "trackwiseAxisTickFormatters"
        ]; 

        // update for all specified properties 
        for (let prop of properties) {
            let updater = props[`ACTION_CHANGE_${prop}`]; 
            let value = config[prop]; 
            // if (!updater || !value) {
            //     console.log(prop, updater, value); 
            // }
            updater(value); 
        }

        // update domain of control scale 
        controlScale.domain(config.timeExtentDomain); 

        // Will trigger rendering of sub-components as store now 
        // holds the initial state of the configuration object that 
        // the user passed in. 
        props.ACTION_CHANGE_storeInit(true); 

    }, []); 

    /*
    SINGLE PROPERTY UPDATES FOR DYNAMIC PROPERTIES 
    */ 

    // useEffect(() => {
    //     props.ACTION_CHANGE_timeDomains(config.timeDomains); 
    // }, [config.timeDomains]); 

    // useEffect(() => {
    //     props.ACTION_CHANGE_trackwiseEncodings(config.trackwiseEncodings); 
    // }, [config.trackwiseEncodings]); 

    // This component does not have a corresponding DOM element 
    return null; 

};

const mapStateToProps = ({ controlScale }) => ({ controlScale }); 

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

    ACTION_CHANGE_storeInit: (storeInit) => 
    dispatch(ACTION_CHANGE_storeInit(storeInit)), 

    ACTION_CHANGE_trackwiseEncodings: (trackwiseEncodings) => 
    dispatch(ACTION_CHANGE_trackwiseEncodings(trackwiseEncodings)),

    ACTION_CHANGE_trackwiseAxisTickFormatters: (trackwiseAxisTickFormatters) => 
    dispatch(ACTION_CHANGE_trackwiseAxisTickFormatters(trackwiseAxisTickFormatters)),

    ACTION_CHANGE_trackwiseNumAxisTicks: (trackwiseNumAxisTicks) => 
    dispatch(ACTION_CHANGE_trackwiseNumAxisTicks(trackwiseNumAxisTicks)),

    ACTION_CHANGE_trackwiseObservations: (trackwiseObservations) => 
    dispatch(ACTION_CHANGE_trackwiseObservations(trackwiseObservations)),

    ACTION_CHANGE_trackwiseTimeKeys: (trackwiseTimeKeys) => 
    dispatch(ACTION_CHANGE_trackwiseTimeKeys(trackwiseTimeKeys)),

    ACTION_CHANGE_trackwiseTypes: (trackwiseTypes) => 
    dispatch(ACTION_CHANGE_trackwiseTypes(trackwiseTypes)),

    ACTION_CHANGE_trackwiseUnits: (trackwiseUnits) => 
    dispatch(ACTION_CHANGE_trackwiseUnits(trackwiseUnits)),

    ACTION_CHANGE_trackwiseValueKeys: (trackwiseValueKeys) => 
    dispatch(ACTION_CHANGE_trackwiseValueKeys(trackwiseValueKeys))

}); 

export default connect(mapStateToProps, mapDispatchToProps, null, { context: PeripheryPlotContext })(PeripheryPlotsUpdateStoreFromConfiguration);


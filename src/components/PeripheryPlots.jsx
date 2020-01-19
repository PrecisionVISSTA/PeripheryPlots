import React from "react";
import PPLOT from "./Wrappers/PPLOT"; 
import PeripheryPlotsContainerizedContent from "./Wrappers/PeripheryPlotsContainerizedContent"; 

const config_defaults = {

    dZoom: 5,
    msecsPadding: 0, 
    contextWidthRatio: .2, 

    containerBackgroundColor: '#ffffff',
    focusColor: '#576369', 
    contextColor: '#9bb1ba', 
    lockActiveColor: '#00496e', 
    lockInactiveColor: 'grey',

    handleOutlineColor: '#000', 
    brushOutlineColor: '#000', 
    lockOutlineColor: '#000', 

    containerPadding: 10, 
    controlTimelineHeight: 50, 
    verticalAlignerHeight: 30, 
    axesWidth: 40, 
    trackHeight: 50, 
    trackSvgOffsetTop: 10, 
    trackSvgOffsetBottom: 5, 

    formatTrackHeader: (valueKey, unit) => {
        return valueKey.replace("_", ' ') + (unit ? ` (${unit})` : ''); 
    }

};

function set_defaults(config) {
    // update config with default properties if they are not specified 
    let default_props = Object.keys(config_defaults); 
    for (let p of default_props) {
        if (config[p] === undefined) {
            config[p] = config_defaults[p]; 
        }
    }
    return config; 
}

export default function PeripheryPlots(props) {
    let Component = props.Component ? props.Component : PeripheryPlotsContainerizedContent; 
    return <PPLOT 
            Component={Component}
            config={set_defaults(props.config)}/> 
}; 
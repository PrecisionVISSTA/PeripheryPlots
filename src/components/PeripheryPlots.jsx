import React from "react";
import PropTypes from 'prop-types';
import { color } from "d3-color"; 
import { timeDay } from 'd3-time'; 
import RootProvider from "./Wrappers/RootProvider";
import PeripheryPlotsContent from "./Wrappers/PeripheryPlotsContent"; 

function assert(condition, errorMsg) {
    if (!condition) throw new Error(errorMsg); 
};

function isObjectAndNotNull(value) {
    return typeof value === 'object' && value !== null; 
};

function errMsg(propName) {
    return `"${propName}" was not of the expected form`; 
};

function isColor(props, propName) {
    // Runs input value through d3 color constructor. If this works, color is valid 
    color(props[propName]);
}; 

function isPositiveNumber(props, propName) { 
    if (!(!isNaN(props[propName]) && props[propName] >= 0)) {
        return new Error(errMsg(propName));
    };
};

export default function PeripheryPlots(props) {
    let config = { ...props }; 
    return (
        <RootProvider>
            <PeripheryPlotsContent config={config}/>
        </RootProvider>
    ); 
}; 

// Default values for optional properties 
PeripheryPlots.defaultProps = {

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

}

PeripheryPlots.propTypes = {

    // TRACKS 

    trackwiseObservations: 
        PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.object)
        )
        .isRequired,

    trackwiseTimeKeys: 
        PropTypes.arrayOf(PropTypes.string)
        .isRequired, 
    
    trackwiseValueKeys:
        PropTypes.arrayOf(PropTypes.string)
        .isRequired, 

    trackwiseTypes: 
        PropTypes.arrayOf(PropTypes.oneOf(['continuous', 'discrete', 'other']))
        .isRequired,
        
    trackwiseUnits: 
        PropTypes.arrayOf(PropTypes.string)
        .isRequired, 

    trackwiseNumAxisTicks: 
        PropTypes.array
        .isRequired,

    trackwiseAxisTickFormatters: 
        PropTypes.array
        .isRequired, 

    trackwiseEncodings: 
        PropTypes.arrayOf(
            PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.elementType)
            )
        )
        .isRequired, 

    applyContextEncodingsUniformly: 
        PropTypes.bool
        .isRequired, 

    numContextsPerSide: 
        function(props, propName) {
            if (!Number.isInteger(props[propName]) && props[propName] > 0) {
                return new Error(errMsg(propName)); 
            }
        },

    contextWidthRatio: 
        function (props, propName) {
            let value = props[propName]; 
            if (!(!isNaN(value) && value >= .01 && value <= .99)) {
                return new Error(errMsg(propName)); 
            }
        },

    // CONTROL TIMELINE 

    tickInterval: 
        function(props, propName) {
            // Ensures input is a d3 time interval 
            if (props[propName].toString() !== timeDay.toString()) {
                throw new Error(errMsg(propName)); 
            }
        }, 

    timeExtentDomain: 
        function (props, propName) {
            let arr = props[propName]; 
            if (!(  Array.isArray(arr) && 
                    arr.length === 2 && 
                    arr[0] instanceof Date && 
                    arr[1] instanceof Date)) {
                return new Error(errMsg(propName))
            }
        }, 

    timeDomains: 
        PropTypes.arrayOf(Date)
        .isRequired, 

    dZoom: 
        isPositiveNumber, 

    // OPTIONAL PROPERTIES 

    containerBackgroundColor: 
        isColor, 

    focusColor: 
        isColor, 

    contextColor: 
        isColor, 

    lockActiveColor: 
        isColor, 

    lockInactiveColor: 
        isColor, 

    containerPadding: 
        isPositiveNumber, 

    controlTimelineHeight: 
        isPositiveNumber, 

    verticalAlignerHeight:  
        isPositiveNumber,  

    axesWidth:  
        isPositiveNumber,  
    
    trackHeight:  
        isPositiveNumber, 

    trackSvgOffsetTop: 
        isPositiveNumber, 
    
    trackSvgOffsetBottom: 
        isPositiveNumber, 

    formatTrackHeader:
        PropTypes.func
      
}
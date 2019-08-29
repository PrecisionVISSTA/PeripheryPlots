import React from "react";
import PropTypes from 'prop-types';
import RootProvider from "./Wrappers/RootProvider.jsx";
import PeripheryPlotsContent from "./Wrappers/PeripheryPlotsContent.jsx"; 
import * as d3 from "d3"; 

function assert(condition, errorMsg) {
    if (!condition) throw new Error(errorMsg); 
}

function isObjectAndNotNull(value) {
    return typeof value === 'object' && value !== null; 
}

function errMsg(propName) {
    return `"${propName}" was not of the expected form`; 
}

function isPositiveNumber(props, propName) { 
    if (!(!isNaN(props[propName]) && props[propName] >= 0)) {
        return new Error(errMsg(propName));
    };
}


export default function PeripheryPlots(props) {
    let config = { ...props }; 
    debugger;
    return (
        <RootProvider>
            <PeripheryPlotsContent config={config}/>
        </RootProvider>
    ); 
}; 

PeripheryPlots.defaultProps = {

    numContextsPerSide: 1, 
    contextWidthRatio: .2, 

    containerBackgroundColor: '#fff',
    containerPadding: 10, 
    controlTimelineHeight: 50, 
    verticalAlignerHeight: 30, 
    axesWidth: 40, 
    trackHeight: 50, 
    trackSvgOffsetTop: 10, 
    trackSvgOffsetBottom: 0

}

PeripheryPlots.propTypes = {

    // REQUIRED PROPERTIES 

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

    trackwiseEncodings: 
        PropTypes.arrayOf(
            PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.elementType)
            )
        )
        .isRequired, 

    trackwiseNumTicks: 
        PropTypes.array, 

    trackwiseAxisTickFormatters: 
        PropTypes.array, 

    tickInterval: function(props, propName) {
        if (props[propName].toString() !== d3.timeDay.toString()) {
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

    applyContextEncodingsUniformly: 
        PropTypes.bool
        .isRequired, 

    // OPTIONAL PROPERTIES 

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

    containerBackgroundColor: 
        function (props, propName) {
            // Runs input value through d3 color constructor. If this works, color is valid 
            d3.color(props[propName]);
        },

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
      
}
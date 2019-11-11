import PeripheryPlots from "./components/PeripheryPlots";

import LineGroup from "./encodings/TVPE/LineGroup"; 
import BarGroup from "./encodings/TVPE/BarGroup"; 
import ScatterGroup from "./encodings/TVPE/ScatterGroup"; 
import EventGroup from "./encodings/TVPE/EventGroup"; 
import MovingAverageEnvelopeGroup from "./encodings/TVPE/MovingAverageEnvelopeGroup"; 
import QuantitativeTraceGroup from "./encodings/VPE/QuantitativeTraceGroup"; 
import NominalTraceGroup from "./encodings/VPE/NominalTraceGroup"; 
import AverageLineGroup from "./encodings/VPE/AverageLineGroup"; 

import getPeripheryPlotSubComponents from "./components/Wrappers/getPeripheryPlotSubComponents"; 
import PeripheryPlotsWrapperHOC from "./components/Wrappers/PeripheryPlotsWrapperHOC"; 

import "./css/PeripheryPlotsDefaultStyle.css"; 

/*
This module exports 
1. The PeripheryPlots React Component
2. All default encodings 

We also import the default stylings for the app here 
*/

export default PeripheryPlots; 

export {

    // Default Encodings 
    LineGroup, 
    BarGroup,
    ScatterGroup,
    EventGroup,
    MovingAverageEnvelopeGroup,
    QuantitativeTraceGroup,
    NominalTraceGroup,
    AverageLineGroup,

    // Distributed Component Rendering 
    PeripheryPlotsWrapperHOC,
    getPeripheryPlotSubComponents

}; 


// initialize store from a configuration object that is 
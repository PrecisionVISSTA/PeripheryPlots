import React from "react";
import PeripheryPlotsWrapperHOC from "./Wrappers/PeripheryPlotsWrapperHOC"; 
import PeripheryPlotsContainerizedContent from "./Wrappers/PeripheryPlotsContainerizedContent"; 

export default function PeripheryPlots(props) {
    let Root = PeripheryPlotsWrapperHOC(PeripheryPlotsContainerizedContent, props.config);
    return <Root/> 
}; 
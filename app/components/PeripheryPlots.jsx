import React from "react";
import RootProvider from "./Wrappers/RootProvider.jsx";
import PeripheryPlotsContent from "./Wrappers/PeripheryPlotsContent.jsx"; 

export default function PeripheryPlots(props) {
    return (
        <RootProvider>
            <PeripheryPlotsContent config={props.config}/>
        </RootProvider>
    ); 
}; 


import React from "react";
import _ from "lodash"; 

import VistaDataProviderWrapper from "./VistaDataProviderWrapper.jsx";
import VistaViewerContent from "./VistaViewerContent.jsx"; 

export default function PeripheryPlots(props) {
    return (
        <VistaDataProviderWrapper>
            <VistaViewerContent config={props.config}/>
        </VistaDataProviderWrapper>
    ); 
}; 


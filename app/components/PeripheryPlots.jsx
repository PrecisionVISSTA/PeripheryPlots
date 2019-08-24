import React from "react";
import _ from "lodash"; 

import VistaDataProviderWrapper from "./VistaDataProviderWrapper.jsx";
import VistaViewerContentHOC from "./VistaViewerContent_HOC.jsx"; 

export default function PeripheryPlots(props) {
    const VistaViewerContent = VistaViewerContentHOC(props.config); 
    return (
        <VistaDataProviderWrapper>
            <VistaViewerContent/>
        </VistaDataProviderWrapper>
    ); 
}; 


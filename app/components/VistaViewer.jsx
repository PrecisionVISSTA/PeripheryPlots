import React from "react";
import _ from "lodash"; 

import VistaDataProviderWrapper from "./VistaDataProviderWrapper.jsx";
import VistaViewerContentHOC from "./VistaViewerContent_HOC.jsx"; 

export default function VistaViewer(props) {
    const VistaViewerContent = VistaViewerContentHOC(props.config); 
    return (
        <VistaDataProviderWrapper>
            <VistaViewerContent/>
        </VistaDataProviderWrapper>
    ); 
}; 


import React from "react"; 
import PeripheryPlotsContext from "../context/periphery-plot-context"; 
import PeripheryPlotsProvider from "./Wrappers/PeripheryPlotsProvider"; 

export default function getPeripheryPlotsPieces(config) {

    

    return {

        /*
        All Periphery Plot sub-components must be rendered within this top level provider 
        */ 
        PeripheryPlotsProvider,
    
    
    };

};




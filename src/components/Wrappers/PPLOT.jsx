import React from "react";
import _ from "lodash"; 
import PeripheryPlotsProvider from "./PeripheryPlotsProvider";
import PeripheryPlotsUpdateStoreFromConfiguration from "./PeripheryPlotsUpdateStoreFromConfig"; 
import PeripheryPlotsDistributedRenderManager from "./PeripheryPlotsDistributedRenderManager"; 

export default function PPLOT(props) {

    const { Component, config } = props; 

    return (
        <React.Fragment>

            {/* Provides data to the periphery plots sub-components  */}
            <PeripheryPlotsProvider>

                {/* Handles updates from configuration object to redux store */}
                <PeripheryPlotsUpdateStoreFromConfiguration config={config}/>

                {/* Renders either a containerized or distributed periphery plots instance */}
                {
                config.distributedMode ? 
                    <PeripheryPlotsDistributedRenderManager fixedWidth={config.fixedWidth}>
                        <Component/>
                    </PeripheryPlotsDistributedRenderManager> 
                    : 
                    <Component/>
                }

            </PeripheryPlotsProvider>

        </React.Fragment>
    );


}; 
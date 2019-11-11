import React from "react";
import _ from "lodash"; 
import PeripheryPlotsProvider from "./PeripheryPlotsProvider";
import PeripheryPlotsConfigurationValidation from "./PeripheryPlotsConfigurationValidation"; 
import PeripheryPlotsUpdateStoreFromConfiguration from "./PeripheryPlotsUpdateStoreFromConfig"; 

export default function PeripheryPlotsWrapperHOC(Component, configToValidate) {

    let { distributedMode } = configToValidate; 

    // function is called after configuration is validated 
    let renderWithConfig = (config) => {
        return (
            <React.Fragment>

                {/* Handles updates from configuration object to redux store */}
                <PeripheryPlotsUpdateStoreFromConfiguration 
                config={config}/>

                {/* Renders either a containerized or distributed periphery plots instance */}
                {
                distributedMode ? 
                    <PeripheryPlotsDistributedRenderManager baseWidth={config.fixedWidth}>
                        <Component/>
                    </PeripheryPlotsDistributedRenderManager> 
                    : 
                    <Component/>
                }

            </React.Fragment>
        ); 
    }

    function PeripheryPlotsWrapper(props) {
        return (
            // Provides data to the periphery plots sub-components 
            <PeripheryPlotsProvider>

                {/* Takes configuration object as input. Validates each
                    individual property. If validation succeeds, it calls
                    the render with conifg function it is passed */}
                <PeripheryPlotsConfigurationValidation 
                {...configToValidate} 
                renderWithConfig={renderWithConfig}/>

            </PeripheryPlotsProvider>
        ); 
    }

    return PeripheryPlotsWrapper; 

}; 

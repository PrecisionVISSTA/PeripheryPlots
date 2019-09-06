import React from "react";
import _ from "lodash"; 
import PeripheryPlotsProvider from "./Wrappers/PeripheryPlotsProvider";
import PeripheryPlotsConfigurationValidation from "./Wrappers/PeripheryPlotsConfigurationValidation"; 
import PeripheryPlotsUpdateStoreFromConfiguration from "./Wrappers/PeripheryPlotsUpdateStoreFromConfig"; 
import PeripheryPlotsContainer from "./Wrappers/PeripheryPlotsContainer"; 
import ControlTimelineDetached from "./Wrappers/ControlTimelineDetached"; 
import ControlAlignerDetached from "./Wrappers/ControlAlignerDetached"; 
import TrackDetached from "./Wrappers/TrackDetached"; 

export default function PeripheryPlots(props) {

    return (
        <PeripheryPlotsProvider>

            <PeripheryPlotsConfigurationValidation 
            {...props.config} 
            renderWithConfig={

                // Callback triggered when configuration object is validated 
                (config) => {
                    return (
                        <React.Fragment>

                            {/* Updates global store when config properties change */}
                            <PeripheryPlotsUpdateStoreFromConfiguration config={config}/>

                            {/* The physical component */}
                            <PeripheryPlotsContainer config={config}>
                                
                                <ControlTimelineDetached/>
                                <ControlAlignerDetached/>
                                {_.range(0, config.trackwiseObservations.length).map(i => <TrackDetached config={config} i={i}/>)}

                            </PeripheryPlotsContainer>

                        </React.Fragment>
                    ) 
                }
            }/>

        </PeripheryPlotsProvider>
    ); 

        // Top level component contains all necessary wrapper for sub-components 
        // <PeripheryPlotsWrapper config={config}>
        //     <div>
        //         <div>
        //             <PeripheryPlotsAligner />
        //         </div>
        //     </div>
        //     <AComponent>
        //         <PeripheryPlotsTrack/>
        //     </AComponent>

        // </PeripheryPlotsWrapper>


}; 

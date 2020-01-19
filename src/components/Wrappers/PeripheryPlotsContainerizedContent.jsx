import React from "react";
import { connect } from "react-redux"; 
import _ from "lodash"; 
import PeripheryPlotsDynamicContainer from "./PeripheryPlotsDynamicContainer"; 
import getPeripheryPlotSubComponents from "./getPeripheryPlotSubComponents"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 

function PeripheryPlotsContainerizedContent(props) {

    const { trackwiseObservations, storeInit } = props; 
    const {
        PeripheryPlotsTimeline,
        PeripheryPlotsAligner,
        PeripheryPlotsTrack
    } = getPeripheryPlotSubComponents(); 

    // We only render content once the baseWidth has been determined, 
    // either by user specification or the fixed width updater component 
    const content = !storeInit ? null : (
        <React.Fragment>

            {/* Timeline */}
            <PeripheryPlotsTimeline/>

            {/* Aligner */}
            <PeripheryPlotsAligner/>
            
            {/* Tracks */}
            {_.range(0, trackwiseObservations.length).map(i =>
                <PeripheryPlotsTrack key={`track-${i}`} i={i}/>
            )}

        </React.Fragment>
    ); 

    return (
        <PeripheryPlotsDynamicContainer>
            {content}
        </PeripheryPlotsDynamicContainer>
    ); 

}; 

const mapStateToProps = ({ 
                            storeInit, 
                            trackwiseObservations
                        }) => 
                        ({ 
                            storeInit, 
                            trackwiseObservations
                        }); 

export default connect(mapStateToProps, null, null, { context: PeripheryPlotContext })(PeripheryPlotsContainerizedContent);

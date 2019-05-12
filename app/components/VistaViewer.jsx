import React from "react";
import { connect } from "react-redux"; 

import { assert } from "chai"; 
import _ from "lodash"; 


import ACTION_CHANGE_timeDomains from "../actions/actions"; 
import { logicalAndOver } from "../util/util"; 

import VistaTimelineControl from "./VistaTimelineControl"; 
import VistaTrack from "./VistaTrack"; 
import VistaDataProviderWrapper from "./VistaDataProviderWrapper";

class VistaViewer extends React.Component {

    render() {

        let {
            // Parameters to construct tracks
            trackwiseObservations,
            trackwiseTimeKeys, 
            trackwiseValueKeys, 
            trackwiseEncodings, 

            // Parameters to construct control 
            timeExtentDomain, 
            timeDomains, 

            // Optional parameters (with defaults)
            numContextsPerSide
            
        } = this.props; 

        assert(
            _.uniq([trackwiseObservations,
                    trackwiseTimeKeys, 
                    trackwiseValueKeys, 
                    trackwiseEncodings
                    ].map(arr => arr.length)).length === 1,
            'Lists used to construct tracks are not of the same length'
        ); 

        let numTracks = trackwiseObservations.length; 

        let inTimeExtent = t => t >= timeExtentDomain[0] && t <= timeExtentDomain[1]; 
        assert(
            logicalAndOver(_.union(...timeDomains.map((tDomain) => logicalAndOver(tDomain.map(inTimeExtent))))), 
            'Some of the specified time domains do not fall within the time extent domain'
        ); 

        return (
            // Connect this component to its own instance of a redux store 
            // This allows us to instantiate multiple VistaViewer components 
            // that each manage their state independently 
            <VistaDataProviderWrapper>
                {/* 
                Timeline that allows user to change selected time domains for focus / context areas 
                Changes that occur in this component are propagated to the global store, which triggers
                view changes for all linked tracks 
                */}
                <VistaTimelineControl
                timeExtentDomain={timeExtentDomain}
                timeDomains={timeDomains}
                updateTimeDomains={ACTION_CHANGE_timeDomains}/>
                {/* 
                Time series tracks 
                */}
                {_.range(0, numTracks).map(i => {
                    let observations = trackwiseObservations[i]; 
                    let timeKey = trackwiseTimeKeys[i]; 
                    let valueKey = trackwiseValueKeys[i]; 
                    let encodings = trackwiseEncodings[i]; 
                    return <VistaTrack
                            observations={observations} 
                            timeKey={timeKey} 
                            valueKey={valueKey}
                            timeDomains={timeDomains} 
                            numContextsPerSide={numContextsPerSide}
                            encodings={encodings}/>; 
                })}
            </VistaDataProviderWrapper>
        );
    }

}

export default VistaViewer; 

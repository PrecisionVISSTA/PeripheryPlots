import React from "react";
import { connect } from "react-redux"; 

import { assert } from "chai"; 
import _ from "lodash"; 


import { logicalAndOver } from "../util/util"; 

import VistaTimelineControl from "./VistaTimelineControl.jsx"; 
// import VistaTrack from "./VistaTrack.jsx"; 
import VistaDataProviderWrapper from "./VistaDataProviderWrapper.jsx";

class VistaViewer extends React.Component {

    getDefaultParametersIfNotSpecified(props) {

        let {
            numContextsPerSide, 
            controlTimelineWidth, 
            controlTimelineHeight, 
            trackWidth, 
            trackHeight, 
            contextWidth
        } = props; 

        if (!numContextsPerSide) numContextsPerSide = 1; 
        if (!controlTimelineHeight) controlTimelineHeight = 50;
        if (!controlTimelineWidth) controlTimelineWidth = 500; 
        if (!trackHeight) trackHeight = 50; 
        if (!trackWidth) trackWidth = 500; 
        if (!contextWidth) contextWidth = 100; 

        return {
            numContextsPerSide, 
            controlTimelineWidth, 
            controlTimelineHeight, 
            trackWidth, 
            trackHeight, 
            contextWidth
        };
    }

    componentDidMount() {
        // After component mounts, we link the passed timeDomains with the global store 
        
    }

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

        } = this.props; 

        let {
            numContextsPerSide, 
            controlTimelineWidth, 
            controlTimelineHeight, 
            trackWidth, 
            trackHeight, 
            contextWidth 

        } = this.getDefaultParametersIfNotSpecified(this.props); 

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
                width={trackWidth}
                height={trackHeight}
                timeExtentDomain={timeExtentDomain}
                timeDomains={timeDomains}/>
                {/* 
                Time series tracks 
                */}
                {/* {_.range(0, numTracks).map(i => {
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
                })} */}
            </VistaDataProviderWrapper>
        );
    }

}

export default VistaViewer; 

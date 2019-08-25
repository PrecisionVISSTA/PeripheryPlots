import React, { useState, useEffect } from "react";
import * as d3 from "d3"; 
import useDimensions from "react-use-dimensions";
import { connect } from "react-redux"; 
import _ from "lodash"; 

import {    ACTION_CHANGE_timeDomains, 
            ACTION_CHANGE_timeExtentDomain, 
            ACTION_CHANGE_baseWidth } from "../actions/actions"; 

import VistaTimelineControl from "./VistaTimelineControl.jsx"; 
import VistaTrack from "./VistaTrack.jsx"; 
import VistaVerticalAligner from "./VistaVerticalAligner.jsx"; 

function VistaViewerContent(props) {

    let {   
        config, 
        baseWidth, 
        controlTimelineHeight, 
        verticalAlignerHeight } = props;

    let {   
        trackwiseObservations,
        trackwiseUnits, 
        trackwiseTimeKeys, 
        trackwiseValueKeys, 
        trackwiseEncodings } = config;

    const [controlScale, setControlScale] = useState(() => d3.scaleTime()); 
    const [ref, { x, y, width }] = useDimensions();

    useEffect(() => {

        // Update global store timeDomains and timeExtentDomain with 
        // user provided configuration values 
        props.ACTION_CHANGE_timeDomains(config.timeDomains); 
        props.ACTION_CHANGE_timeExtentDomain(config.timeExtentDomain);  

    }, []); 

    useEffect(() => {

        // When we are able to measure dimensions of parent container, update global store 
        if (!isNaN(width)) {
            props.ACTION_CHANGE_baseWidth(width); 
            setControlScale(scale => scale.domain(config.timeExtentDomain)
                                          .range([0, width])); 
            
        }
        
    }, [width]); 

    let doRender = controlScale.range()[1] > 0 && baseWidth > 0; 

    return (
    <div ref={ref} style={{ width: '100%', border: '1px solid red' }}>
        {doRender ? 
            <VistaTimelineControl
            controlScale={controlScale}
            width={baseWidth}
            height={controlTimelineHeight}/> 
            : null
        }
    </div>
    ); 

}

const mapStateToProps = ({ 
    controlTimelineHeight, 
    baseWidth, 
    verticalAlignerHeight
}) => 
({
    controlTimelineHeight, 
    baseWidth, 
    verticalAlignerHeight
}); 

const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_timeDomains: (timeDomains) => 
    dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 

    ACTION_CHANGE_timeExtentDomain: (timeExtentDomain) => 
    dispatch(ACTION_CHANGE_timeExtentDomain(timeExtentDomain)), 

    ACTION_CHANGE_baseWidth: (baseWidth) => 
    dispatch(ACTION_CHANGE_baseWidth(baseWidth))

}); 

export default connect(mapStateToProps, mapDispatchToProps)(VistaViewerContent);

    // class VistaViewerContent extends React.Component {
    
    //     componentDidMount() {
            
    //     }
    
    //     render() {

                
    //         return (
    //             <React.Fragment>
                    
                    

    //                 {/* <VistaVerticalAligner
    //                 controlScale={controlScale}
    //                 width={baseWidth}
    //                 height={verticalAlignerHeight}/> */}

    //                 {/* 
    //                 Time series tracks 
    //                 */}
    //                 {/* {_.range(0, trackwiseObservations.length).map(i => {
    //                     let observations = trackwiseObservations[i]; 
    //                     let timeKey = trackwiseTimeKeys[i]; 
    //                     let valueKey = trackwiseValueKeys[i]; 
    //                     let encodings = trackwiseEncodings[i]; 
    //                     let unit = trackwiseUnits[i]; 
    //                     return (
    //                         <VistaTrack
    //                         controlScale={controlScale}
    //                         id={`track-${i}`}
    //                         key={`track-${i}`}
    //                         title={valueKey}
    //                         unit={unit}
    //                         observations={observations} 
    //                         timeKey={timeKey} 
    //                         valueKey={valueKey}
    //                         encodings={encodings}/>
    //                     ); 
    //                 })} */}
    //             </React.Fragment>
    //         );
    //     }
    
    // } 




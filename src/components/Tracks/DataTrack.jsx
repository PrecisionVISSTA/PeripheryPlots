import React from "react"; 
import { connect } from "react-redux"; 
import Track from "./Track"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 

export function DataTrack(props) {

    let {   
        i, 
        trackwiseObservations,
        trackwiseUnits, 
        trackwiseTimeKeys, 
        trackwiseValueKeys,  
        trackwiseTypes, 
        trackwiseNumAxisTicks,
        trackwiseAxisTickFormatters, 
        trackwiseEncodings 
    } = props;

    let observations = trackwiseObservations[i]; 
    let encodings = trackwiseEncodings[i]; 
    let timeKey = trackwiseTimeKeys[i]; 
    let valueKey = trackwiseValueKeys[i]; 
    let type = trackwiseTypes[i];  
    let unit = trackwiseUnits[i]; 
    let numAxisTicks = trackwiseNumAxisTicks ? trackwiseNumAxisTicks[i] : null; 
    let axisTickFormatter = trackwiseAxisTickFormatters ? trackwiseAxisTickFormatters[i] : null; 

    return (
        <Track
        id={`track-${i}`}
        key={`track-${i}`}
        type={type}
        unit={unit}
        numAxisTicks={numAxisTicks}
        axisTickFormatter={axisTickFormatter}
        observations={observations} 
        encodings={encodings}
        timeKey={timeKey} 
        valueKey={valueKey}
        i={i}/>
    ); 

}

const mapStateToProps = ({ 
                            trackwiseObservations,
                            trackwiseUnits, 
                            trackwiseTimeKeys, 
                            trackwiseValueKeys,  
                            trackwiseTypes, 
                            trackwiseNumAxisTicks,
                            trackwiseAxisTickFormatters, 
                            trackwiseEncodings 
                        }) => 
                        ({ 
                            trackwiseObservations,
                            trackwiseUnits, 
                            trackwiseTimeKeys, 
                            trackwiseValueKeys,  
                            trackwiseTypes, 
                            trackwiseNumAxisTicks,
                            trackwiseAxisTickFormatters, 
                            trackwiseEncodings 
                        });

export default connect(mapStateToProps, null, null, { context: PeripheryPlotContext })(DataTrack);

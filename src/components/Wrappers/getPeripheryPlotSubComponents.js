import React from "react"; 
import ControlToTrackAligner from "../Aligner/ControlToTrackAligner";
import TimelineControl from '../ControlTimeline/TimelineControl';  
import DataTrack from "../Tracks/DataTrack"; 

export default function getPeripheryPlotSubComponents() {

    return {
        PeripheryPlotsTimeline: TimelineControl, 
        PeripheryPlotsAligner: ControlToTrackAligner, 
        PeripheryPlotsTrack: DataTrack
    }; 

}
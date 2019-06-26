import _ from "lodash"; 
import { packMultiIndex } from "./VistaTimelineControlUtility.js"; 
import { BRUSH_ACTIONS } from "./VistaTimelineControlConfiguration.js"; 

function RESIZE_revertTargetToPreviousState(index, actionProperties) {
    let { preS, currentSelections } = actionProperties; 
    currentSelections[index] = preS; 
}

export function perform_RESIZE(actionKey, actionProperties, index) {

    // Get the translation action functions corresponding to the 
    // executed action (a left or right translation).
    // let { 


    
    //     TRANSLATE_computeNonTargetShifts, 
    //     TRANSLATE_resizeLockedBound
    // } = translationMapper[actionKey]; 


    // Step through the resize action lifecycle 
    if (actionProperties.isLocked) {
        RESIZE_revertTargetToPreviousState(index, actionProperties); 
    } else {
        // let { shift, propShift } = TRANSLATE_computeNonTargetShifts(actionProperties); 
        // TRANSLATE_performNonTargetShifts(index, actionProperties, shift); 
        // TRANSLATE_computeAndPerformTargetCorrectingShift(actionProperties, index, shift, propShift); 
        // TRANSLATE_resizeLockedBound(actionProperties, shift); 
    }

    // Return the resulting state 
    let { currentSelections, shiftSet } = actionProperties;  
    return { currentSelections, shiftSet };  

}
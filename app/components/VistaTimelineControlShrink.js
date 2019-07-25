import _ from "lodash"; 
import { BRUSH_ACTIONS } from "./VistaTimelineControlConfiguration.js"; 

function SHRINK_revertTargetToPreviousState(index, actionProperties) {
    let { preS, currentSelections } = actionProperties; 
    currentSelections[index] = preS; 
}

function SHRINK_LEFT_computeAndPerformNonTargetShifts(index, actionProperties) {
    let { curS, preS, lockedToLeft, currentSelections, leftLockIndex, leftLockBoundS, minWidth, leftIndexRange, tooSmall, shiftSet } = actionProperties; 
    let shift, shiftIndices; 
    if (tooSmall) {
        currentSelections[index] = [preS[1] - minWidth, preS[1]];
        shift = currentSelections[index][0] - preS[0];
    } else {
        shift = curS[0] - preS[0]; 
    }
    if (lockedToLeft) {
        currentSelections[leftLockIndex] = [leftLockBoundS[0],
                                            leftLockBoundS[1] + shift]; 
        shiftIndices = _.range(leftLockIndex + 1, index); 
    } else {
        shiftIndices = _.range(...leftIndexRange); 
    }
    shiftSet.push({ shift, shiftIndices });  
}

function SHRINK_RIGHT_computeAndPerformNonTargetShifts(index, actionProperties) {
    let { curS, preS, lockedToRight, currentSelections, rightLockIndex, rightLockBoundS, minWidth, rightIndexRange, tooSmall, shiftSet } = actionProperties; 
    let shift, shiftIndices; 
    if (tooSmall) {
        currentSelections[index] = [preS[0], preS[0] + minWidth];
        shift = currentSelections[index][1] - preS[1];   
    } else {
        shift = curS[1] - preS[1];  
    }
    if (lockedToRight) {
        currentSelections[rightLockIndex] = [rightLockBoundS[0] + shift, 
                                             rightLockBoundS[1]];
        shiftIndices = _.range(index + 1, rightLockIndex); 
    } else {
        shiftIndices = _.range(...rightIndexRange);
    }
    shiftSet.push({ shift, shiftIndices });  
}

function SHRINK_LEFT_isTargetHandleLocked(actionProperties) {
    return actionProperties.leftHandleLocked; 
}

function SHRINK_RIGHT_isTargetHandleLocked(actionProperties) {
    return actionProperties.rightHandleLocked; 
}

const lifecycle = {}; 
lifecycle[BRUSH_ACTIONS.RESIZE_SHRINK_LEFT] = {
    SHRINK_isTargetHandleLocked: SHRINK_LEFT_isTargetHandleLocked,
    SHRINK_computeAndPerformNonTargetShifts: SHRINK_LEFT_computeAndPerformNonTargetShifts
}; 
lifecycle[BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT] = {
    SHRINK_isTargetHandleLocked: SHRINK_RIGHT_isTargetHandleLocked,
    SHRINK_computeAndPerformNonTargetShifts: SHRINK_RIGHT_computeAndPerformNonTargetShifts
}

export function perform_SHRINK(actionKey, actionProperties, index) {

    // Get the shrink action functions corresponding to the 
    // executed action (a left or right shrink).
    let { SHRINK_isTargetHandleLocked,
          SHRINK_computeAndPerformNonTargetShifts 
    } = lifecycle[actionKey]; 

    // Step through the shrink action lifecycle 
    if (SHRINK_isTargetHandleLocked(actionProperties)) {
        SHRINK_revertTargetToPreviousState(index, actionProperties); 
    } else {
        SHRINK_computeAndPerformNonTargetShifts(index, actionProperties);
    }

    // Return the resulting state 
    let { currentSelections, shiftSet } = actionProperties;  
    return { currentSelections, shiftSet };  

}
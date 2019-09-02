import _ from "lodash"; 
import { BRUSH_ACTIONS } from "./TimelineControlConfiguration";
import { packMultiIndex } from "./TimelineControlUtility"; 

function GROW_revertTargetToPreviousState(index, actionProperties) {
    let { preS, currentSelections } = actionProperties; 
    currentSelections[index] = preS; 
}

function GROW_RIGHT_computeNonTargetShifts(actionProperties) {
    let { preS, curS, rightLockIndex, minWidth, currentSelections, lockedToRight } = actionProperties; 
    let shift = 0; 
    let propShift = curS[1] - preS[1]; 
    if (lockedToRight) {
        let rightLockedS = currentSelections[rightLockIndex];
        let newRightLockedS0 = Math.min(rightLockedS[1] - minWidth, rightLockedS[0] + propShift); 
        let newRightLockedS1 = rightLockedS[1]; 
        let newRightLockedS = [newRightLockedS0, newRightLockedS1];   
        currentSelections[rightLockIndex] = newRightLockedS; 
        shift = newRightLockedS[0] - rightLockedS[0]; 
    } else {
        shift = propShift; 
    }

    return { shift, propShift }; 
}

function GROW_LEFT_computeNonTargetShifts(actionProperties) {
    let { preS, curS, leftLockIndex, minWidth, currentSelections, lockedToLeft } = actionProperties; 
    let shift = 0; 
    let propShift = curS[0] - preS[0]; 
    if (lockedToLeft) {
        let leftLockedS = currentSelections[leftLockIndex];
        let newLeftLockedS0 = leftLockedS[0]; 
        let newLeftLockedS1 = Math.max(leftLockedS[0] + minWidth, leftLockedS[1] + propShift); 
        let newLeftLockedS = [newLeftLockedS0, newLeftLockedS1]; 
        currentSelections[leftLockIndex] = newLeftLockedS; 
        shift = newLeftLockedS[1] - leftLockedS[1]; 
    } else {
        shift = propShift; 
    }
    return { shift, propShift }; 
}

function GROW_RIGHT_performNonTargetShifts(index, actionProperties, shift) {
    let { shiftSet, lockedToRight, rightLockIndex, numBrushes } = actionProperties;
    shiftSet.push({
        shift, 
        shiftIndices: packMultiIndex([
            // between the target and the (right locked brush OR right lock bound)
            [index + 1, lockedToRight ? rightLockIndex : numBrushes]
        ])
    });
}

function GROW_LEFT_performNonTargetShifts(index, actionProperties, shift) {
    let { shiftSet, lockedToLeft, leftLockIndex } = actionProperties; 
    shiftSet.push({
        shift, 
        shiftIndices: packMultiIndex([
            // between the target and the (left locked brush OR left lock bound)
            [lockedToLeft ? leftLockIndex + 1: 0, index]
        ])
    });
}

function GROW_LEFT_correctTargetSelection(index, actionProperties, shift, propShift) {
    let { currentSelections } = actionProperties; 
    if (shift - propShift !== 0) {
        currentSelections[index][0] += shift - propShift; 
    }
}

function GROW_RIGHT_correctTargetSelection(index, actionProperties, shift, propShift) {
    let { currentSelections } = actionProperties; 
    if (shift - propShift !== 0) {
        currentSelections[index][1] += shift - propShift; 
    }
}

function GROW_LEFT_isTargetHandleLocked(actionProperties) {
    return actionProperties.leftHandleLocked; 
}

function GROW_RIGHT_isTargetHandleLocked(actionProperties) {
    return actionProperties.rightHandleLocked; 
}

const lifecycle = {}; 
lifecycle[BRUSH_ACTIONS.RESIZE_GROW_LEFT] = {
    GROW_isTargetHandleLocked: GROW_LEFT_isTargetHandleLocked, 
    GROW_computeNonTargetShifts: GROW_LEFT_computeNonTargetShifts,
    GROW_performNonTargetShifts: GROW_LEFT_performNonTargetShifts,
    GROW_correctTargetSelection: GROW_LEFT_correctTargetSelection
}; 
lifecycle[BRUSH_ACTIONS.RESIZE_GROW_RIGHT] = {
    GROW_isTargetHandleLocked: GROW_RIGHT_isTargetHandleLocked, 
    GROW_computeNonTargetShifts: GROW_RIGHT_computeNonTargetShifts, 
    GROW_performNonTargetShifts: GROW_RIGHT_performNonTargetShifts, 
    GROW_correctTargetSelection: GROW_RIGHT_correctTargetSelection
}

export function perform_GROW(actionKey, actionProperties, index) {

    // Get the grow action functions corresponding to the 
    // executed action (a left or right grow).
    let { 
        GROW_isTargetHandleLocked, 
        GROW_computeNonTargetShifts,
        GROW_performNonTargetShifts,
        GROW_correctTargetSelection
    } = lifecycle[actionKey]; 

    // Step through the translation action lifecycle 
    if (GROW_isTargetHandleLocked(actionProperties)) {
        GROW_revertTargetToPreviousState(index, actionProperties); 
    } else {
        let { shift, propShift } = GROW_computeNonTargetShifts(actionProperties); 
        GROW_performNonTargetShifts(index, actionProperties, shift); 
        GROW_correctTargetSelection(index, actionProperties, shift, propShift); 
    }

    // Return the resulting state 
    let { currentSelections, shiftSet } = actionProperties;  
    return { currentSelections, shiftSet };  

}
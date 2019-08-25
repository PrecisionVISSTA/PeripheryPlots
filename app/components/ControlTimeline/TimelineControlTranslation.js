import _ from "lodash"; 
import { packMultiIndex } from "./TimelineControlUtility.js"; 
import { BRUSH_ACTIONS } from "./TimelineControlConfiguration.js"; 

function TRANSLATE_revertTargetToPreviousState(index, actionProperties) {
    let { shiftSet, previousSelections, curS } = actionProperties; 
    shiftSet.push({ 
        shiftIndices: [index], 
        shift: previousSelections[index][1] - curS[1]
    });
}

function TRANSLATE_RIGHT_computeNonTargetShifts(actionProperties) {
    let { curS, preS, lockedToRight, currentSelections, rightLockIndex, minWidth } = actionProperties; 
    let shift = 0; 
    let propShift = curS[0] - preS[0]; 
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

function TRANSLATE_LEFT_computeNonTargetShifts(actionProperties) {
    let { curS, preS, lockedToLeft, leftLockIndex, currentSelections, minWidth } = actionProperties; 
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

function TRANSLATE_performNonTargetShifts(index, actionProperties, shift) {
    let { shiftSet, lockedToLeft, leftLockIndex, lockedToRight, rightLockIndex, numBrushes } = actionProperties; 
    shiftSet.push({
        shift, 
        shiftIndices: packMultiIndex([
            // between the target and the (left locked brush OR left brush bound)
            [lockedToLeft ? leftLockIndex + 1 : 0, index], 
            // between the target and the (right locked brush OR right lock bound)
            [index + 1, lockedToRight ? rightLockIndex : numBrushes]
        ])
    });
}

function TRANSLATE_computeAndPerformTargetCorrectingShift(actionProperties, index, shift, propShift) {
    let { shiftSet } = actionProperties; 
    if (shift - propShift !== 0) {
        shiftSet.push({
            shift: shift - propShift, 
            shiftIndices: [index]
        });
    }
}

function TRANSLATE_RIGHT_resizeLockedBound(actionProperties, shift) {
    let { lockedToLeft, currentSelections, leftLockIndex } = actionProperties; 
    if (lockedToLeft) {
        currentSelections[leftLockIndex] = [currentSelections[leftLockIndex][0], 
                                            currentSelections[leftLockIndex][1] + shift];
    }
}

function TRANSLATE_LEFT_resizeLockedBound(actionProperties, shift) {
    let { lockedToRight, currentSelections, rightLockIndex } = actionProperties; 
    if (lockedToRight) {
        currentSelections[rightLockIndex] = [currentSelections[rightLockIndex][0] + shift, 
                                             currentSelections[rightLockIndex][1]]; 
    }
}

const lifecycle = {}; 

lifecycle[BRUSH_ACTIONS.TRANSLATE_LEFT] = {
    TRANSLATE_computeNonTargetShifts: TRANSLATE_LEFT_computeNonTargetShifts,
    TRANSLATE_resizeLockedBound: TRANSLATE_LEFT_resizeLockedBound
}; 
lifecycle[BRUSH_ACTIONS.TRANSLATE_RIGHT] = {
    TRANSLATE_computeNonTargetShifts: TRANSLATE_RIGHT_computeNonTargetShifts,
    TRANSLATE_resizeLockedBound: TRANSLATE_RIGHT_resizeLockedBound
};

export function perform_TRANSLATE(actionKey, actionProperties, index) {

    // Get the translation action functions corresponding to the 
    // executed action (a left or right translation).
    let { 
        TRANSLATE_computeNonTargetShifts, 
        TRANSLATE_resizeLockedBound
    } = lifecycle[actionKey]; 

    // Step through the translation action lifecycle 
    if (actionProperties.isLocked) {
        TRANSLATE_revertTargetToPreviousState(index, actionProperties); 
    } else {
        let { shift, propShift } = TRANSLATE_computeNonTargetShifts(actionProperties); 
        TRANSLATE_performNonTargetShifts(index, actionProperties, shift); 
        TRANSLATE_computeAndPerformTargetCorrectingShift(actionProperties, index, shift, propShift); 
        TRANSLATE_resizeLockedBound(actionProperties, shift); 
    }

    // Return the resulting state 
    let { currentSelections, shiftSet } = actionProperties;  
    return { currentSelections, shiftSet };  

}
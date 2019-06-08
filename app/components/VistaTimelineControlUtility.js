import _ from "lodash"; 

export const CONTROL_CONFIGURATION = {
  MARGIN: {
    left: 0, 
    right: 0, 
    top: 0, 
    bottom: 5
  },
  LOCK_WIDTH: 10, 
  LOCK_HEIGHT: 10, 
  LOCK_ACTIVE_COLOR: "grey", 
  LOCK_INACTIVE_COLOR: "black", 
  HANDLE_WIDTH: 12, 
  HANDLE_HEIGHT: 12, 
  MIN_CONTEXT_WIDTH: 24, 
  MIN_FOCUS_WIDTH: 24
}

let { HANDLE_WIDTH, MIN_CONTEXT_WIDTH } = CONTROL_CONFIGURATION; 

const brushActions = {
  RESIZE_SHRINK_LEFT: 0, 
  RESIZE_SHRINK_RIGHT: 1, 
  RESIZE_GROW_LEFT: 2, 
  RESIZE_GROW_RIGHT: 3, 
  TRANSLATE_LEFT: 4, 
  TRANSLATE_RIGHT: 5
}; 

// Two utility functions for preprocessing the index ranges to ensure they are valid 
const forceNonDecreasing = dup => dup[0] > dup[1] ? [0,0] : dup; 
const packMultiIndex = arrs => arrs.reduce((all,arr) => _.union(all, _.range(...forceNonDecreasing(arr))), []);

const actions = {
  perform_RESIZE_SHRINK_LEFT: (index, actionProperties) => {

    // Unpack properties 
    let { 
      leftHandleLocked, 
      tooSmall, 
      preS, 
      curS, 
      minWidth, 
      leftLockIndex, 
      leftLockBoundS, 
      shiftSet, 
      leftIndexRange, 
      lockedToLeft, 
      currentSelections
    } = actionProperties; 

    // Perform action 
    let shift, shiftIndices; 
    if (leftHandleLocked) {
      currentSelections[index] = preS;
    } else {
      if (tooSmall) {
        currentSelections[index] = [preS[1] - minWidth, preS[1]];
        shift = currentSelections[index][0] - preS[0];
      } else {
        shift = curS[0] - preS[0]; 
      }
      if (lockedToLeft) {
        currentSelections[leftLockIndex] = [leftLockBoundS[0],
                                        leftLockBoundS[1] + shift]; 
        shiftIndices = _.range(leftIndexRange[0] + 1, leftIndexRange[1]); 
      } else {
        shiftIndices = _.range(...leftIndexRange); 
      }
    }
    shiftSet.push({
      shift, shiftIndices
    }); 

    // Return new state 
    return { shiftSet, currentSelections }; 
  },
  perform_RESIZE_SHRINK_RIGHT: (index, actionProperties) => {

    let { 
      rightHandleLocked, 
      currentSelections, 
      preS, 
      curS, 
      tooSmall, 
      minWidth, 
      shiftSet, 
      lockedToRight, 
      rightLockBoundS, 
      rightIndexRange, 
      rightLockIndex 
    } = actionProperties; 

    let shift, shiftIndices; 
    if (rightHandleLocked) {
      currentSelections[index] = preS;
    } else {
      if (tooSmall) {
        currentSelections[index] = [preS[0], preS[0] + minWidth];
        shift = currentSelections[index][1] - preS[1];   
      } else {
        shift = curS[1] - preS[1];  
      }
      if (lockedToRight) {
        currentSelections[rightLockIndex] = [rightLockBoundS[0], 
                                          rightLockBoundS[1] + shift];
        shiftIndices = _.range(index + 1, rightLockIndex); 
      } else {
        shiftIndices = _.range(...rightIndexRange);
      }
    }
    shiftSet.push({
      shift, shiftIndices
    }); 

    return { shiftSet, currentSelections }; 
  },
  perform_RESIZE_GROW_LEFT: (index, actionProperties) => {

    let { 
      leftHandleLocked, 
      currentSelections, 
      preS, 
      curS, 
      shiftSet, 
      leftIndexRange
    } = actionProperties; 

    if (leftHandleLocked) {
      currentSelections[index] = preS; 
    } else {
      shiftSet.push({
        shift: curS[0] - preS[0], 
        shiftIndices: _.range(...leftIndexRange)
      });
    }

    return { shiftSet, currentSelections }; 
  },
  perform_RESIZE_GROW_RIGHT: (index, actionProperties) => {

    let { 
      rightHandleLocked, 
      currentSelections, 
      preS, 
      curS, 
      shiftSet, 
      rightIndexRange
    } = actionProperties; 

    if (rightHandleLocked) {
      currentSelections[index] = preS; 
    } else {
      shiftSet.push({
        shift: curS[1] - preS[1], 
        shiftIndices: _.range(...rightIndexRange)
      });
    }

    return { shiftSet, currentSelections }; 
  },
  perform_TRANSLATE_LEFT: (index, actionProperties) => {

    let { 
      isLocked, 
      lockedToLeft, 
      lockedToRight, 
      leftLockIndex, 
      rightLockIndex, 
      currentSelections, 
      preS, 
      curS, 
      shiftSet, 
      numBrushes, 
      isFocus
    } = actionProperties; 

    let revertTargetToPreviousState = () => shiftSet.push({ 
      shift: currentSelections[index-1][1] - curS[0], 
      shiftIndices: [index]
    });
    
    let shift, propShift, targetShift; 
    if (isLocked) {
      revertTargetToPreviousState(); 
    } else {
      if (isFocus) {
        /*  Compute the shift (if one exists) to apply to all elements 
            1. between the target and the (left locked brush OR left brush bound)
            2. between the target and the (right locked brush OR right lock bound)
        */
        propShift = curS[0] - preS[0]; 
        let leftLockedS = null;
        let newLeftLockedS = null; 
        if (lockedToLeft) {
          leftLockedS = currentSelections[leftLockIndex];
          newLeftLockedS = [leftLockedS[0], Math.max(leftLockedS[0] + MIN_CONTEXT_WIDTH, 
                                                     leftLockedS[1] + propShift)];
          currentSelections[leftLockIndex] = newLeftLockedS; 
          shift = newLeftLockedS[1] - leftLockedS[1]; 
        } else {
          shift = propShift; 
        }
        shiftSet.push({
          shift, 
          shiftIndices: packMultiIndex([
            // between the target and the (left locked brush OR left brush bound)
            [lockedToLeft ? leftLockIndex + 1 : 0, 
              index], 
            // between the target and the (right locked brush OR right lock bound)
            [index + 1, 
              lockedToRight ? rightLockIndex : numBrushes]
          ])
        });

        // The target brush was moved by this event. Correct its position by computing the 
        // Difference between the shift applied to the left locked brush and the target brush
        targetShift = shift - propShift; 
        if (targetShift !== 0) {
          shiftSet.push({
            shift: targetShift, 
            shiftIndices: [index]
          });
        }

        // The amount that the leftLockedBrush shrunk by is the amount the rightLockedBrush grows by  
        if (lockedToRight) {
          currentSelections[rightLockIndex] = [currentSelections[rightLockIndex][0] + shift, 
                                               currentSelections[rightLockIndex][1]]
        }
      } else {
        if (lockedToLeft || lockedToRight) {
          // Freeze contexts if lock exists to right / left 
          revertTargetToPreviousState();
        } else {
          // Shift all brushes except for the target 
          shiftSet.push({
            shift: curS[0] - preS[0], 
            shiftIndices: _.range(0, numBrushes).filter(i => i !== index)
          }); 
        }
      } 
    }

    return { currentSelections, shiftSet }; 
  },
  perform_TRANSLATE_RIGHT: (index, actionProperties) => {

    let { 
      isLocked, 
      lockedToLeft, 
      lockedToRight, 
      leftLockIndex, 
      rightLockIndex, 
      currentSelections, 
      preS, 
      curS, 
      shiftSet, 
      numBrushes, 
      isFocus
    } = actionProperties; 

    let revertTargetToPreviousState = () => shiftSet.push({ 
      shift: currentSelections[index-1][1] - curS[0], 
      shiftIndices: [index]
    });
    
    let shift, propShift, targetShift; 
    if (isLocked) {
      revertTargetToPreviousState(); 
    } else {
      if (isFocus) {
        /*  Compute the shift (if one exists) to apply to all elements 
            1. between the target and the (left locked brush OR left brush bound)
            2. between the target and the (right locked brush OR right lock bound)
        */
        propShift = curS[0] - preS[0]; 
        let rightLockedS = null;
        let newRightLockedS = null; 
        if (lockedToRight) {
          rightLockedS = currentSelections[rightLockIndex];
          newRightLockedS = [Math.min(rightLockedS[1] - MIN_CONTEXT_WIDTH, 
                                      rightLockedS[0] + propShift),
                             rightLockedS[1]];   
          currentSelections[rightLockIndex] = newRightLockedS; 
          shift = newRightLockedS[0] - rightLockedS[0]; 
        } else {
          shift = propShift; 
        }

        shiftSet.push({
          shift, 
          shiftIndices: packMultiIndex([
            // between the target and the (left locked brush OR left brush bound)
            [lockedToLeft ? leftLockIndex + 1 : 0, 
             index], 
            // between the target and the (right locked brush OR right lock bound)
            [index + 1, 
              lockedToRight ? rightLockIndex : numBrushes]
          ])
        });

        // The target brush was moved by this event. Correct its position by computing the 
        // Difference between the shift applied to the left locked brush and the target brush
        targetShift = shift - propShift; 
        if (targetShift !== 0) {
          shiftSet.push({
            shift: targetShift, 
            shiftIndices: [index]
          });
        }

        // The amount that the rigthLockedBrush shrunk by is the amount the leftLockedBrush grows by  
        if (lockedToLeft) {
          currentSelections[leftLockIndex] = [currentSelections[leftLockIndex][0], 
                                              currentSelections[leftLockIndex][1] + shift]; 
        }
      } else {
        if (lockedToLeft || lockedToRight) {
          // Freeze contexts if lock exists to right / left 
          revertTargetToPreviousState();
        } else {
          // Shift all brushes except for the target 
          shiftSet.push({
            shift: curS[0] - preS[0], 
            shiftIndices: _.range(0, numBrushes).filter(i => i !== index)
          }); 
        }
      } 
    }
  
    return { currentSelections, shiftSet }; 
  }

};

export const performShifts = (selections, shiftIndices, shift) => (
  shift !== 0 ? selections.map((s,i) => shiftIndices.includes(i) ? s.map(e => e + shift) : s) : 
                selections
); 
  
export const computeActionFromSelectionTransition = (preS, curS) => {
  return  (preS[0] < curS[0] && preS[1] === curS[1]) ? brushActions.RESIZE_SHRINK_LEFT : 
          (preS[0] > curS[0] && preS[1] === curS[1]) ? brushActions.RESIZE_GROW_LEFT :
          (preS[1] > curS[1] && preS[0] === curS[0]) ? brushActions.RESIZE_SHRINK_RIGHT : 
          (preS[1] < curS[1] && preS[0] === curS[0]) ? brushActions.RESIZE_GROW_RIGHT :           
          (preS[0] > curS[0] && preS[1] > curS[1]) ?   brushActions.TRANSLATE_LEFT : 
          (preS[0] < curS[0] && preS[1] < curS[1]) ?   brushActions.TRANSLATE_RIGHT : 
          null;
}
  
export const functionFromAction = (currentAction) => {
  switch (currentAction) {
    case brushActions.RESIZE_SHRINK_LEFT:   return actions.perform_RESIZE_SHRINK_LEFT;
    case brushActions.RESIZE_SHRINK_RIGHT:  return actions.perform_RESIZE_SHRINK_RIGHT;
    case brushActions.RESIZE_GROW_LEFT:     return actions.perform_RESIZE_GROW_LEFT; 
    case brushActions.RESIZE_GROW_RIGHT:    return actions.perform_RESIZE_GROW_RIGHT; 
    case brushActions.TRANSLATE_LEFT:       return actions.perform_TRANSLATE_LEFT;
    case brushActions.TRANSLATE_RIGHT:      return actions.perform_TRANSLATE_RIGHT; 
    default:                                return null; 
  }
}
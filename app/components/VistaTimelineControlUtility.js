import _ from "lodash"; 
import { perform_TRANSLATE } from "./VistaTimelineControlTranslation.js";  
import { BRUSH_ACTIONS } from "./VistaTimelineControlConfiguration.js"; 

// Two utility functions for preprocessing the index ranges to ensure they are valid 
export const forceNonDecreasing = dup => dup[0] > dup[1] ? [0,0] : dup; 
export const packMultiIndex = arrs => arrs.reduce((all,arr) => _.union(all, _.range(...forceNonDecreasing(arr))), []);

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
    return perform_TRANSLATE(BRUSH_ACTIONS.TRANSLATE_LEFT, actionProperties, index);
  },
  perform_TRANSLATE_RIGHT: (index, actionProperties) => {
    return perform_TRANSLATE(BRUSH_ACTIONS.TRANSLATE_RIGHT, actionProperties, index);
  }

};

export const performShifts = (selections, shiftIndices, shift) => (
  shift !== 0 ? selections.map((s,i) => shiftIndices.includes(i) ? s.map(e => e + shift) : s) : 
                selections
); 
  
export const computeActionFromSelectionTransition = (preS, curS) => {
  return  (preS[0] < curS[0] && preS[1] === curS[1]) ? BRUSH_ACTIONS.RESIZE_SHRINK_LEFT : 
          (preS[0] > curS[0] && preS[1] === curS[1]) ? BRUSH_ACTIONS.RESIZE_GROW_LEFT :
          (preS[1] > curS[1] && preS[0] === curS[0]) ? BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT : 
          (preS[1] < curS[1] && preS[0] === curS[0]) ? BRUSH_ACTIONS.RESIZE_GROW_RIGHT :           
          (preS[0] > curS[0] && preS[1] > curS[1]) ?   BRUSH_ACTIONS.TRANSLATE_LEFT : 
          (preS[0] < curS[0] && preS[1] < curS[1]) ?   BRUSH_ACTIONS.TRANSLATE_RIGHT : 
          null;
}
  
export const functionFromAction = (currentAction) => {
  switch (currentAction) {
    case BRUSH_ACTIONS.RESIZE_SHRINK_LEFT:   return actions.perform_RESIZE_SHRINK_LEFT;
    case BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT:  return actions.perform_RESIZE_SHRINK_RIGHT;
    case BRUSH_ACTIONS.RESIZE_GROW_LEFT:     return actions.perform_RESIZE_GROW_LEFT; 
    case BRUSH_ACTIONS.RESIZE_GROW_RIGHT:    return actions.perform_RESIZE_GROW_RIGHT; 
    case BRUSH_ACTIONS.TRANSLATE_LEFT:       return actions.perform_TRANSLATE_LEFT;
    case BRUSH_ACTIONS.TRANSLATE_RIGHT:      return actions.perform_TRANSLATE_RIGHT; 
    default:                                return null; 
  }
}
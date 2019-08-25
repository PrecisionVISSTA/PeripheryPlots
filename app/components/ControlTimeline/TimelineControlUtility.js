import _ from "lodash"; 
import { perform_TRANSLATE } from "./TimelineControlTranslation.js";  
import { perform_SHRINK } from "./TimelineControlShrink.js"; 
import { perform_GROW } from "./TimelineControlGrow.js"; 
import { BRUSH_ACTIONS } from "./TimelineControlConfiguration.js"; 

// Two utility functions for preprocessing the index ranges to ensure they are valid 
export const forceNonDecreasing = dup => dup[0] > dup[1] ? [0,0] : dup; 
export const packMultiIndex = arrs => arrs.reduce((all,arr) => _.union(all, _.range(...forceNonDecreasing(arr))), []);

const actions = {
  // SHRINK SINGLE HANDLE 
  perform_RESIZE_SHRINK_LEFT: (index, actionProperties) => 
    perform_SHRINK(BRUSH_ACTIONS.RESIZE_SHRINK_LEFT, actionProperties, index),
  perform_RESIZE_SHRINK_RIGHT: (index, actionProperties) => 
    perform_SHRINK(BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT, actionProperties, index),

  // GROW SINGLE HANDLE 
  perform_RESIZE_GROW_LEFT: (index, actionProperties) => 
    perform_GROW(BRUSH_ACTIONS.RESIZE_GROW_LEFT, actionProperties, index),
  perform_RESIZE_GROW_RIGHT: (index, actionProperties) => 
    perform_GROW(BRUSH_ACTIONS.RESIZE_GROW_RIGHT, actionProperties, index),

  // TRANSLATIONS
  perform_TRANSLATE_LEFT: (index, actionProperties) => 
    perform_TRANSLATE(BRUSH_ACTIONS.TRANSLATE_LEFT, actionProperties, index),
  perform_TRANSLATE_RIGHT: (index, actionProperties) => 
    perform_TRANSLATE(BRUSH_ACTIONS.TRANSLATE_RIGHT, actionProperties, index),

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
    default:                                 return null; 
  }
}


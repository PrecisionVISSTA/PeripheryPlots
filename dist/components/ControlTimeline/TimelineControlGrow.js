"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.perform_GROW = perform_GROW;

var _lodash = _interopRequireDefault(require("lodash"));

var _TimelineControlConfiguration = require("./TimelineControlConfiguration");

var _TimelineControlUtility = require("./TimelineControlUtility");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function GROW_revertTargetToPreviousState(index, actionProperties) {
  var preS = actionProperties.preS,
      currentSelections = actionProperties.currentSelections;
  currentSelections[index] = preS;
}

function GROW_RIGHT_computeNonTargetShifts(actionProperties) {
  var preS = actionProperties.preS,
      curS = actionProperties.curS,
      rightLockIndex = actionProperties.rightLockIndex,
      minWidth = actionProperties.minWidth,
      currentSelections = actionProperties.currentSelections,
      lockedToRight = actionProperties.lockedToRight;
  var shift = 0;
  var propShift = curS[1] - preS[1];

  if (lockedToRight) {
    var rightLockedS = currentSelections[rightLockIndex];
    var newRightLockedS0 = Math.min(rightLockedS[1] - minWidth, rightLockedS[0] + propShift);
    var newRightLockedS1 = rightLockedS[1];
    var newRightLockedS = [newRightLockedS0, newRightLockedS1];
    currentSelections[rightLockIndex] = newRightLockedS;
    shift = newRightLockedS[0] - rightLockedS[0];
  } else {
    shift = propShift;
  }

  return {
    shift: shift,
    propShift: propShift
  };
}

function GROW_LEFT_computeNonTargetShifts(actionProperties) {
  var preS = actionProperties.preS,
      curS = actionProperties.curS,
      leftLockIndex = actionProperties.leftLockIndex,
      minWidth = actionProperties.minWidth,
      currentSelections = actionProperties.currentSelections,
      lockedToLeft = actionProperties.lockedToLeft;
  var shift = 0;
  var propShift = curS[0] - preS[0];

  if (lockedToLeft) {
    var leftLockedS = currentSelections[leftLockIndex];
    var newLeftLockedS0 = leftLockedS[0];
    var newLeftLockedS1 = Math.max(leftLockedS[0] + minWidth, leftLockedS[1] + propShift);
    var newLeftLockedS = [newLeftLockedS0, newLeftLockedS1];
    currentSelections[leftLockIndex] = newLeftLockedS;
    shift = newLeftLockedS[1] - leftLockedS[1];
  } else {
    shift = propShift;
  }

  return {
    shift: shift,
    propShift: propShift
  };
}

function GROW_RIGHT_performNonTargetShifts(index, actionProperties, shift) {
  var shiftSet = actionProperties.shiftSet,
      lockedToRight = actionProperties.lockedToRight,
      rightLockIndex = actionProperties.rightLockIndex,
      numBrushes = actionProperties.numBrushes;
  shiftSet.push({
    shift: shift,
    shiftIndices: (0, _TimelineControlUtility.packMultiIndex)([// between the target and the (right locked brush OR right lock bound)
    [index + 1, lockedToRight ? rightLockIndex : numBrushes]])
  });
}

function GROW_LEFT_performNonTargetShifts(index, actionProperties, shift) {
  var shiftSet = actionProperties.shiftSet,
      lockedToLeft = actionProperties.lockedToLeft,
      leftLockIndex = actionProperties.leftLockIndex;
  shiftSet.push({
    shift: shift,
    shiftIndices: (0, _TimelineControlUtility.packMultiIndex)([// between the target and the (left locked brush OR left lock bound)
    [lockedToLeft ? leftLockIndex + 1 : 0, index]])
  });
}

function GROW_LEFT_correctTargetSelection(index, actionProperties, shift, propShift) {
  var currentSelections = actionProperties.currentSelections;

  if (shift - propShift !== 0) {
    currentSelections[index][0] += shift - propShift;
  }
}

function GROW_RIGHT_correctTargetSelection(index, actionProperties, shift, propShift) {
  var currentSelections = actionProperties.currentSelections;

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

var lifecycle = {};
lifecycle[_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_LEFT] = {
  GROW_isTargetHandleLocked: GROW_LEFT_isTargetHandleLocked,
  GROW_computeNonTargetShifts: GROW_LEFT_computeNonTargetShifts,
  GROW_performNonTargetShifts: GROW_LEFT_performNonTargetShifts,
  GROW_correctTargetSelection: GROW_LEFT_correctTargetSelection
};
lifecycle[_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_RIGHT] = {
  GROW_isTargetHandleLocked: GROW_RIGHT_isTargetHandleLocked,
  GROW_computeNonTargetShifts: GROW_RIGHT_computeNonTargetShifts,
  GROW_performNonTargetShifts: GROW_RIGHT_performNonTargetShifts,
  GROW_correctTargetSelection: GROW_RIGHT_correctTargetSelection
};

function perform_GROW(actionKey, actionProperties, index) {
  // Get the grow action functions corresponding to the 
  // executed action (a left or right grow).
  var _lifecycle$actionKey = lifecycle[actionKey],
      GROW_isTargetHandleLocked = _lifecycle$actionKey.GROW_isTargetHandleLocked,
      GROW_computeNonTargetShifts = _lifecycle$actionKey.GROW_computeNonTargetShifts,
      GROW_performNonTargetShifts = _lifecycle$actionKey.GROW_performNonTargetShifts,
      GROW_correctTargetSelection = _lifecycle$actionKey.GROW_correctTargetSelection; // Step through the translation action lifecycle 

  if (GROW_isTargetHandleLocked(actionProperties)) {
    GROW_revertTargetToPreviousState(index, actionProperties);
  } else {
    var _GROW_computeNonTarge = GROW_computeNonTargetShifts(actionProperties),
        shift = _GROW_computeNonTarge.shift,
        propShift = _GROW_computeNonTarge.propShift;

    GROW_performNonTargetShifts(index, actionProperties, shift);
    GROW_correctTargetSelection(index, actionProperties, shift, propShift);
  } // Return the resulting state 


  var currentSelections = actionProperties.currentSelections,
      shiftSet = actionProperties.shiftSet;
  return {
    currentSelections: currentSelections,
    shiftSet: shiftSet
  };
}
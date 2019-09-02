"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.perform_TRANSLATE = perform_TRANSLATE;

var _lodash = _interopRequireDefault(require("lodash"));

var _TimelineControlUtility = require("./TimelineControlUtility.js");

var _TimelineControlConfiguration = require("./TimelineControlConfiguration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TRANSLATE_revertTargetToPreviousState(index, actionProperties) {
  var shiftSet = actionProperties.shiftSet,
      previousSelections = actionProperties.previousSelections,
      curS = actionProperties.curS;
  shiftSet.push({
    shiftIndices: [index],
    shift: previousSelections[index][1] - curS[1]
  });
}

function TRANSLATE_RIGHT_computeNonTargetShifts(actionProperties) {
  var curS = actionProperties.curS,
      preS = actionProperties.preS,
      lockedToRight = actionProperties.lockedToRight,
      currentSelections = actionProperties.currentSelections,
      rightLockIndex = actionProperties.rightLockIndex,
      minWidth = actionProperties.minWidth;
  var shift = 0;
  var propShift = curS[0] - preS[0];

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

function TRANSLATE_LEFT_computeNonTargetShifts(actionProperties) {
  var curS = actionProperties.curS,
      preS = actionProperties.preS,
      lockedToLeft = actionProperties.lockedToLeft,
      leftLockIndex = actionProperties.leftLockIndex,
      currentSelections = actionProperties.currentSelections,
      minWidth = actionProperties.minWidth;
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

function TRANSLATE_performNonTargetShifts(index, actionProperties, shift) {
  var shiftSet = actionProperties.shiftSet,
      lockedToLeft = actionProperties.lockedToLeft,
      leftLockIndex = actionProperties.leftLockIndex,
      lockedToRight = actionProperties.lockedToRight,
      rightLockIndex = actionProperties.rightLockIndex,
      numBrushes = actionProperties.numBrushes;
  shiftSet.push({
    shift: shift,
    shiftIndices: (0, _TimelineControlUtility.packMultiIndex)([// between the target and the (left locked brush OR left brush bound)
    [lockedToLeft ? leftLockIndex + 1 : 0, index], // between the target and the (right locked brush OR right lock bound)
    [index + 1, lockedToRight ? rightLockIndex : numBrushes]])
  });
}

function TRANSLATE_computeAndPerformTargetCorrectingShift(actionProperties, index, shift, propShift) {
  var shiftSet = actionProperties.shiftSet;

  if (shift - propShift !== 0) {
    shiftSet.push({
      shift: shift - propShift,
      shiftIndices: [index]
    });
  }
}

function TRANSLATE_RIGHT_resizeLockedBound(actionProperties, shift) {
  var lockedToLeft = actionProperties.lockedToLeft,
      currentSelections = actionProperties.currentSelections,
      leftLockIndex = actionProperties.leftLockIndex;

  if (lockedToLeft) {
    currentSelections[leftLockIndex] = [currentSelections[leftLockIndex][0], currentSelections[leftLockIndex][1] + shift];
  }
}

function TRANSLATE_LEFT_resizeLockedBound(actionProperties, shift) {
  var lockedToRight = actionProperties.lockedToRight,
      currentSelections = actionProperties.currentSelections,
      rightLockIndex = actionProperties.rightLockIndex;

  if (lockedToRight) {
    currentSelections[rightLockIndex] = [currentSelections[rightLockIndex][0] + shift, currentSelections[rightLockIndex][1]];
  }
}

var lifecycle = {};
lifecycle[_TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_LEFT] = {
  TRANSLATE_computeNonTargetShifts: TRANSLATE_LEFT_computeNonTargetShifts,
  TRANSLATE_resizeLockedBound: TRANSLATE_LEFT_resizeLockedBound
};
lifecycle[_TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_RIGHT] = {
  TRANSLATE_computeNonTargetShifts: TRANSLATE_RIGHT_computeNonTargetShifts,
  TRANSLATE_resizeLockedBound: TRANSLATE_RIGHT_resizeLockedBound
};

function perform_TRANSLATE(actionKey, actionProperties, index) {
  // Get the translation action functions corresponding to the 
  // executed action (a left or right translation).
  var _lifecycle$actionKey = lifecycle[actionKey],
      TRANSLATE_computeNonTargetShifts = _lifecycle$actionKey.TRANSLATE_computeNonTargetShifts,
      TRANSLATE_resizeLockedBound = _lifecycle$actionKey.TRANSLATE_resizeLockedBound; // Step through the translation action lifecycle 

  if (actionProperties.isLocked) {
    TRANSLATE_revertTargetToPreviousState(index, actionProperties);
  } else {
    var _TRANSLATE_computeNon = TRANSLATE_computeNonTargetShifts(actionProperties),
        shift = _TRANSLATE_computeNon.shift,
        propShift = _TRANSLATE_computeNon.propShift;

    TRANSLATE_performNonTargetShifts(index, actionProperties, shift);
    TRANSLATE_computeAndPerformTargetCorrectingShift(actionProperties, index, shift, propShift);
    TRANSLATE_resizeLockedBound(actionProperties, shift);
  } // Return the resulting state 


  var currentSelections = actionProperties.currentSelections,
      shiftSet = actionProperties.shiftSet;
  return {
    currentSelections: currentSelections,
    shiftSet: shiftSet
  };
}
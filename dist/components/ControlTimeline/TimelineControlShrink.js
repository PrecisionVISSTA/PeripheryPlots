"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.perform_SHRINK = perform_SHRINK;

var _lodash = _interopRequireDefault(require("lodash"));

var _TimelineControlConfiguration = require("./TimelineControlConfiguration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function SHRINK_revertTargetToPreviousState(index, actionProperties) {
  var preS = actionProperties.preS,
      currentSelections = actionProperties.currentSelections;
  currentSelections[index] = preS;
}

function SHRINK_LEFT_computeAndPerformNonTargetShifts(index, actionProperties) {
  var curS = actionProperties.curS,
      preS = actionProperties.preS,
      lockedToLeft = actionProperties.lockedToLeft,
      currentSelections = actionProperties.currentSelections,
      leftLockIndex = actionProperties.leftLockIndex,
      leftLockBoundS = actionProperties.leftLockBoundS,
      minWidth = actionProperties.minWidth,
      leftIndexRange = actionProperties.leftIndexRange,
      tooSmall = actionProperties.tooSmall,
      shiftSet = actionProperties.shiftSet;
  var shift, shiftIndices;

  if (tooSmall) {
    currentSelections[index] = [preS[1] - minWidth, preS[1]];
    shift = currentSelections[index][0] - preS[0];
  } else {
    shift = curS[0] - preS[0];
  }

  if (lockedToLeft) {
    currentSelections[leftLockIndex] = [leftLockBoundS[0], leftLockBoundS[1] + shift];
    shiftIndices = _lodash["default"].range(leftLockIndex + 1, index);
  } else {
    shiftIndices = _lodash["default"].range.apply(_lodash["default"], _toConsumableArray(leftIndexRange));
  }

  shiftSet.push({
    shift: shift,
    shiftIndices: shiftIndices
  });
}

function SHRINK_RIGHT_computeAndPerformNonTargetShifts(index, actionProperties) {
  var curS = actionProperties.curS,
      preS = actionProperties.preS,
      lockedToRight = actionProperties.lockedToRight,
      currentSelections = actionProperties.currentSelections,
      rightLockIndex = actionProperties.rightLockIndex,
      rightLockBoundS = actionProperties.rightLockBoundS,
      minWidth = actionProperties.minWidth,
      rightIndexRange = actionProperties.rightIndexRange,
      tooSmall = actionProperties.tooSmall,
      shiftSet = actionProperties.shiftSet;
  var shift, shiftIndices;

  if (tooSmall) {
    currentSelections[index] = [preS[0], preS[0] + minWidth];
    shift = currentSelections[index][1] - preS[1];
  } else {
    shift = curS[1] - preS[1];
  }

  if (lockedToRight) {
    currentSelections[rightLockIndex] = [rightLockBoundS[0] + shift, rightLockBoundS[1]];
    shiftIndices = _lodash["default"].range(index + 1, rightLockIndex);
  } else {
    shiftIndices = _lodash["default"].range.apply(_lodash["default"], _toConsumableArray(rightIndexRange));
  }

  shiftSet.push({
    shift: shift,
    shiftIndices: shiftIndices
  });
}

function SHRINK_LEFT_isTargetHandleLocked(actionProperties) {
  return actionProperties.leftHandleLocked;
}

function SHRINK_RIGHT_isTargetHandleLocked(actionProperties) {
  return actionProperties.rightHandleLocked;
}

var lifecycle = {};
lifecycle[_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_LEFT] = {
  SHRINK_isTargetHandleLocked: SHRINK_LEFT_isTargetHandleLocked,
  SHRINK_computeAndPerformNonTargetShifts: SHRINK_LEFT_computeAndPerformNonTargetShifts
};
lifecycle[_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT] = {
  SHRINK_isTargetHandleLocked: SHRINK_RIGHT_isTargetHandleLocked,
  SHRINK_computeAndPerformNonTargetShifts: SHRINK_RIGHT_computeAndPerformNonTargetShifts
};

function perform_SHRINK(actionKey, actionProperties, index) {
  // Get the shrink action functions corresponding to the 
  // executed action (a left or right shrink).
  var _lifecycle$actionKey = lifecycle[actionKey],
      SHRINK_isTargetHandleLocked = _lifecycle$actionKey.SHRINK_isTargetHandleLocked,
      SHRINK_computeAndPerformNonTargetShifts = _lifecycle$actionKey.SHRINK_computeAndPerformNonTargetShifts; // Step through the shrink action lifecycle 

  if (SHRINK_isTargetHandleLocked(actionProperties)) {
    SHRINK_revertTargetToPreviousState(index, actionProperties);
  } else {
    SHRINK_computeAndPerformNonTargetShifts(index, actionProperties);
  } // Return the resulting state 


  var currentSelections = actionProperties.currentSelections,
      shiftSet = actionProperties.shiftSet;
  return {
    currentSelections: currentSelections,
    shiftSet: shiftSet
  };
}
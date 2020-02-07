"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionFromAction = exports.computeActionFromSelectionTransition = exports.performShifts = exports.packMultiIndex = exports.forceNonDecreasing = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _TimelineControlTranslation = require("./TimelineControlTranslation");

var _TimelineControlShrink = require("./TimelineControlShrink");

var _TimelineControlGrow = require("./TimelineControlGrow");

var _TimelineControlConfiguration = require("./TimelineControlConfiguration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Two utility functions for preprocessing the index ranges to ensure they are valid 
var forceNonDecreasing = function forceNonDecreasing(dup) {
  return dup[0] > dup[1] ? [0, 0] : dup;
};

exports.forceNonDecreasing = forceNonDecreasing;

var packMultiIndex = function packMultiIndex(arrs) {
  return arrs.reduce(function (all, arr) {
    return _lodash["default"].union(all, _lodash["default"].range.apply(_lodash["default"], _toConsumableArray(forceNonDecreasing(arr))));
  }, []);
};

exports.packMultiIndex = packMultiIndex;
var actions = {
  // SHRINK SINGLE HANDLE 
  perform_RESIZE_SHRINK_LEFT: function perform_RESIZE_SHRINK_LEFT(index, actionProperties) {
    return (0, _TimelineControlShrink.perform_SHRINK)(_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_LEFT, actionProperties, index);
  },
  perform_RESIZE_SHRINK_RIGHT: function perform_RESIZE_SHRINK_RIGHT(index, actionProperties) {
    return (0, _TimelineControlShrink.perform_SHRINK)(_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT, actionProperties, index);
  },
  // GROW SINGLE HANDLE 
  perform_RESIZE_GROW_LEFT: function perform_RESIZE_GROW_LEFT(index, actionProperties) {
    return (0, _TimelineControlGrow.perform_GROW)(_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_LEFT, actionProperties, index);
  },
  perform_RESIZE_GROW_RIGHT: function perform_RESIZE_GROW_RIGHT(index, actionProperties) {
    return (0, _TimelineControlGrow.perform_GROW)(_TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_RIGHT, actionProperties, index);
  },
  // TRANSLATIONS
  perform_TRANSLATE_LEFT: function perform_TRANSLATE_LEFT(index, actionProperties) {
    return (0, _TimelineControlTranslation.perform_TRANSLATE)(_TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_LEFT, actionProperties, index);
  },
  perform_TRANSLATE_RIGHT: function perform_TRANSLATE_RIGHT(index, actionProperties) {
    return (0, _TimelineControlTranslation.perform_TRANSLATE)(_TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_RIGHT, actionProperties, index);
  }
};

var performShifts = function performShifts(selections, shiftIndices, shift) {
  return shift !== 0 ? selections.map(function (s, i) {
    return shiftIndices.includes(i) ? s.map(function (e) {
      return e + shift;
    }) : s;
  }) : selections;
};

exports.performShifts = performShifts;

var computeActionFromSelectionTransition = function computeActionFromSelectionTransition(preS, curS) {
  return preS[0] < curS[0] && preS[1] === curS[1] || preS[1] === curS[0] ? _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_LEFT : preS[0] > curS[0] && preS[1] === curS[1] ? _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_LEFT : preS[1] > curS[1] && preS[0] === curS[0] || preS[0] === preS[1] ? _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT : preS[1] < curS[1] && preS[0] === curS[0] ? _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_RIGHT : preS[0] > curS[0] && preS[1] > curS[1] ? _TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_LEFT : preS[0] < curS[0] && preS[1] < curS[1] ? _TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_RIGHT : null;
};

exports.computeActionFromSelectionTransition = computeActionFromSelectionTransition;

var functionFromAction = function functionFromAction(currentAction) {
  switch (currentAction) {
    case _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_LEFT:
      return actions.perform_RESIZE_SHRINK_LEFT;

    case _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_SHRINK_RIGHT:
      return actions.perform_RESIZE_SHRINK_RIGHT;

    case _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_LEFT:
      return actions.perform_RESIZE_GROW_LEFT;

    case _TimelineControlConfiguration.BRUSH_ACTIONS.RESIZE_GROW_RIGHT:
      return actions.perform_RESIZE_GROW_RIGHT;

    case _TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_LEFT:
      return actions.perform_TRANSLATE_LEFT;

    case _TimelineControlConfiguration.BRUSH_ACTIONS.TRANSLATE_RIGHT:
      return actions.perform_TRANSLATE_RIGHT;

    default:
      return null;
  }
};

exports.functionFromAction = functionFromAction;
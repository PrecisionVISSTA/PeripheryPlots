"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PeripheryPlots;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d3Color = require("d3-color");

var _d3Time = require("d3-time");

var _RootProvider = _interopRequireDefault(require("./Wrappers/RootProvider"));

var _PeripheryPlotsContent = _interopRequireDefault(require("./Wrappers/PeripheryPlotsContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function assert(condition, errorMsg) {
  if (!condition) throw new Error(errorMsg);
}

;

function isObjectAndNotNull(value) {
  return _typeof(value) === 'object' && value !== null;
}

;

function errMsg(propName) {
  return "\"".concat(propName, "\" was not of the expected form");
}

;

function isColor(props, propName) {
  // Runs input value through d3 color constructor. If this works, color is valid 
  (0, _d3Color.color)(props[propName]);
}

;

function isPositiveNumber(props, propName) {
  if (!(!isNaN(props[propName]) && props[propName] >= 0)) {
    return new Error(errMsg(propName));
  }

  ;
}

;

function PeripheryPlots(props) {
  var config = _objectSpread({}, props);

  return _react["default"].createElement(_RootProvider["default"], null, _react["default"].createElement(_PeripheryPlotsContent["default"], {
    config: config
  }));
}

; // Default values for optional properties 

PeripheryPlots.defaultProps = {
  dZoom: 5,
  numContextsPerSide: 1,
  contextWidthRatio: .2,
  containerBackgroundColor: '#ffffff',
  focusColor: '#576369',
  contextColor: '#9bb1ba',
  lockActiveColor: '#00496e',
  lockInactiveColor: 'grey',
  containerPadding: 10,
  controlTimelineHeight: 50,
  verticalAlignerHeight: 30,
  axesWidth: 40,
  trackHeight: 50,
  trackSvgOffsetTop: 10,
  trackSvgOffsetBottom: 5,
  formatTrackHeader: function formatTrackHeader(valueKey, unit) {
    return valueKey.replace("_", ' ') + (unit ? " (".concat(unit, ")") : '');
  }
};
PeripheryPlots.propTypes = {
  // TRACKS 
  trackwiseObservations: _propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].object)).isRequired,
  trackwiseTimeKeys: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  trackwiseValueKeys: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  trackwiseTypes: _propTypes["default"].arrayOf(_propTypes["default"].oneOf(['continuous', 'discrete', 'other'])).isRequired,
  trackwiseUnits: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  trackwiseNumAxisTicks: _propTypes["default"].array.isRequired,
  trackwiseAxisTickFormatters: _propTypes["default"].array.isRequired,
  trackwiseEncodings: _propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].elementType))).isRequired,
  applyContextEncodingsUniformly: _propTypes["default"].bool.isRequired,
  numContextsPerSide: function numContextsPerSide(props, propName) {
    if (!Number.isInteger(props[propName]) && props[propName] > 0) {
      return new Error(errMsg(propName));
    }
  },
  contextWidthRatio: function contextWidthRatio(props, propName) {
    var value = props[propName];

    if (!(!isNaN(value) && value >= .01 && value <= .99)) {
      return new Error(errMsg(propName));
    }
  },
  // CONTROL TIMELINE 
  tickInterval: function tickInterval(props, propName) {
    // Ensures input is a d3 time interval 
    if (props[propName].toString() !== _d3Time.timeDay.toString()) {
      throw new Error(errMsg(propName));
    }
  },
  timeExtentDomain: function timeExtentDomain(props, propName) {
    var arr = props[propName];

    if (!(Array.isArray(arr) && arr.length === 2 && arr[0] instanceof Date && arr[1] instanceof Date)) {
      return new Error(errMsg(propName));
    }
  },
  timeDomains: _propTypes["default"].arrayOf(Date).isRequired,
  dZoom: isPositiveNumber,
  // OPTIONAL PROPERTIES 
  containerBackgroundColor: isColor,
  focusColor: isColor,
  contextColor: isColor,
  lockActiveColor: isColor,
  lockInactiveColor: isColor,
  containerPadding: isPositiveNumber,
  controlTimelineHeight: isPositiveNumber,
  verticalAlignerHeight: isPositiveNumber,
  axesWidth: isPositiveNumber,
  trackHeight: isPositiveNumber,
  trackSvgOffsetTop: isPositiveNumber,
  trackSvgOffsetBottom: isPositiveNumber,
  formatTrackHeader: _propTypes["default"].func
};
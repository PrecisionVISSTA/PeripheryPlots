"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PeripheryPlots;

var _react = _interopRequireDefault(require("react"));

var _PPLOT = _interopRequireDefault(require("./Wrappers/PPLOT"));

var _PeripheryPlotsContainerizedContent = _interopRequireDefault(require("./Wrappers/PeripheryPlotsContainerizedContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config_defaults = {
  dZoom: 5,
  msecsPadding: 0,
  contextWidthRatio: .2,
  containerBackgroundColor: '#ffffff',
  focusColor: '#576369',
  contextColor: '#9bb1ba',
  lockActiveColor: '#00496e',
  lockInactiveColor: 'grey',
  handleOutlineColor: '#000',
  brushOutlineColor: '#000',
  lockOutlineColor: '#000',
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

function set_defaults(config) {
  // update config with default properties if they are not specified 
  var default_props = Object.keys(config_defaults);

  for (var _i = 0, _default_props = default_props; _i < _default_props.length; _i++) {
    var p = _default_props[_i];

    if (config[p] === undefined) {
      config[p] = config_defaults[p];
    }
  }

  return config;
}

function PeripheryPlots(props) {
  var Component = props.Component ? props.Component : _PeripheryPlotsContainerizedContent["default"];
  return _react["default"].createElement(_PPLOT["default"], {
    Component: Component,
    config: set_defaults(props.config)
  });
}

;
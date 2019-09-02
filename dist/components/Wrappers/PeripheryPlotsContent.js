"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _d3Scale = require("d3-scale");

var _reactUseDimensions = _interopRequireDefault(require("react-use-dimensions"));

var _reactRedux = require("react-redux");

var _lodash = _interopRequireDefault(require("lodash"));

var _actions = require("../../actions/actions");

var _TimelineControl = _interopRequireDefault(require("../ControlTimeline/TimelineControl"));

var _Track = _interopRequireDefault(require("../Tracks/Track"));

var _ControlToTrackAligner = _interopRequireDefault(require("../Aligner/ControlToTrackAligner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PeripheryPlotsContent(props) {
  var config = props.config,
      baseWidth = props.baseWidth,
      controlTimelineHeight = props.controlTimelineHeight,
      verticalAlignerHeight = props.verticalAlignerHeight;
  var trackwiseObservations = config.trackwiseObservations,
      trackwiseUnits = config.trackwiseUnits,
      trackwiseTimeKeys = config.trackwiseTimeKeys,
      trackwiseValueKeys = config.trackwiseValueKeys,
      trackwiseEncodings = config.trackwiseEncodings,
      trackwiseTypes = config.trackwiseTypes,
      trackwiseNumAxisTicks = config.trackwiseNumAxisTicks,
      trackwiseAxisTickFormatters = config.trackwiseAxisTickFormatters;

  var _useState = (0, _react.useState)(function () {
    return (0, _d3Scale.scaleTime)();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      controlScale = _useState2[0],
      setControlScale = _useState2[1];

  var _useDimensions = (0, _reactUseDimensions["default"])(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      ref = _useDimensions2[0],
      width = _useDimensions2[1].width;

  (0, _react.useEffect)(function () {
    // When we are able to measure dimensions of parent container, update global store 
    if (!isNaN(width)) {
      props.ACTION_CHANGE_baseWidth(width);
      setControlScale(function (scale) {
        return scale.domain(config.timeExtentDomain).range([0, width]);
      });
    }
  }, [width]); // Update store with these properties anytime config changes 

  (0, _react.useEffect)(function () {
    var updateProps = ['containerPadding', 'controlTimelineHeight', 'verticalAlignerHeight', 'axesWidth', 'trackHeight', 'trackSvgOffsetTop', 'trackSvgOffsetBottom', 'focusColor', 'contextColor', 'lockActiveColor', 'lockInactiveColor', 'dZoom', 'timeDomains', 'timeExtentDomain', 'contextWidthRatio', 'numContextsPerSide', 'tickInterval', 'applyContextEncodingsUniformly', 'formatTrackHeader'];

    for (var _i2 = 0, _updateProps = updateProps; _i2 < _updateProps.length; _i2++) {
      var p = _updateProps[_i2];

      if (config[p] !== undefined) {
        props["ACTION_CHANGE_".concat(p)](config[p]);
      }
    }
  }, [config]);
  var doRender = controlScale.range()[1] > 0 && baseWidth > 0;
  var containerBackgroundColor = config.containerBackgroundColor === undefined ? '#fff' : config.containerBackgroundColor;
  return _react["default"].createElement("div", {
    ref: ref,
    style: {
      width: '100%',
      backgroundColor: containerBackgroundColor
    }
  }, doRender ? _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(_TimelineControl["default"], {
    controlScale: controlScale,
    width: baseWidth,
    height: controlTimelineHeight
  }), _react["default"].createElement(_ControlToTrackAligner["default"], {
    controlScale: controlScale,
    width: baseWidth,
    height: verticalAlignerHeight
  }), _lodash["default"].range(0, trackwiseObservations.length).map(function (i) {
    var observations = trackwiseObservations[i];
    var timeKey = trackwiseTimeKeys[i];
    var valueKey = trackwiseValueKeys[i];
    var encodings = trackwiseEncodings[i];
    var type = trackwiseTypes[i];
    var unit = trackwiseUnits[i];
    var numAxisTicks = trackwiseNumAxisTicks ? trackwiseNumAxisTicks[i] : null;
    var axisTickFormatter = trackwiseAxisTickFormatters ? trackwiseAxisTickFormatters[i] : null;
    return _react["default"].createElement(_Track["default"], {
      controlScale: controlScale,
      id: "track-".concat(i),
      key: "track-".concat(i),
      type: type,
      unit: unit,
      numAxisTicks: numAxisTicks,
      axisTickFormatter: axisTickFormatter,
      observations: observations,
      timeKey: timeKey,
      valueKey: valueKey,
      encodings: encodings
    });
  })) : null);
}

var mapStateToProps = function mapStateToProps(_ref) {
  var controlTimelineHeight = _ref.controlTimelineHeight,
      baseWidth = _ref.baseWidth,
      verticalAlignerHeight = _ref.verticalAlignerHeight;
  return {
    controlTimelineHeight: controlTimelineHeight,
    baseWidth: baseWidth,
    verticalAlignerHeight: verticalAlignerHeight
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    ACTION_CHANGE_timeDomains: function ACTION_CHANGE_timeDomains(timeDomains) {
      return dispatch((0, _actions.ACTION_CHANGE_timeDomains)(timeDomains));
    },
    ACTION_CHANGE_timeExtentDomain: function ACTION_CHANGE_timeExtentDomain(timeExtentDomain) {
      return dispatch((0, _actions.ACTION_CHANGE_timeExtentDomain)(timeExtentDomain));
    },
    ACTION_CHANGE_baseWidth: function ACTION_CHANGE_baseWidth(baseWidth) {
      return dispatch((0, _actions.ACTION_CHANGE_baseWidth)(baseWidth));
    },
    ACTION_CHANGE_contextWidthRatio: function ACTION_CHANGE_contextWidthRatio(contextWidthRatio) {
      return dispatch((0, _actions.ACTION_CHANGE_contextWidthRatio)(contextWidthRatio));
    },
    ACTION_CHANGE_numContextsPerSide: function ACTION_CHANGE_numContextsPerSide(numContextsPerSide) {
      return dispatch((0, _actions.ACTION_CHANGE_numContextsPerSide)(numContextsPerSide));
    },
    ACTION_CHANGE_containerPadding: function ACTION_CHANGE_containerPadding(containerPadding) {
      return dispatch((0, _actions.ACTION_CHANGE_containerPadding)(containerPadding));
    },
    ACTION_CHANGE_controlTimelineHeight: function ACTION_CHANGE_controlTimelineHeight(controlTimelineHeight) {
      return dispatch((0, _actions.ACTION_CHANGE_controlTimelineHeight)(controlTimelineHeight));
    },
    ACTION_CHANGE_verticalAlignerHeight: function ACTION_CHANGE_verticalAlignerHeight(verticalAlignerHeight) {
      return dispatch((0, _actions.ACTION_CHANGE_verticalAlignerHeight)(verticalAlignerHeight));
    },
    ACTION_CHANGE_axesWidth: function ACTION_CHANGE_axesWidth(axesWidth) {
      return dispatch((0, _actions.ACTION_CHANGE_axesWidth)(axesWidth));
    },
    ACTION_CHANGE_trackHeight: function ACTION_CHANGE_trackHeight(trackHeight) {
      return dispatch((0, _actions.ACTION_CHANGE_trackHeight)(trackHeight));
    },
    ACTION_CHANGE_trackSvgOffsetTop: function ACTION_CHANGE_trackSvgOffsetTop(trackSvgOffsetTop) {
      return dispatch((0, _actions.ACTION_CHANGE_trackSvgOffsetTop)(trackSvgOffsetTop));
    },
    ACTION_CHANGE_trackSvgOffsetBottom: function ACTION_CHANGE_trackSvgOffsetBottom(trackSvgOffsetBottom) {
      return dispatch((0, _actions.ACTION_CHANGE_trackSvgOffsetBottom)(trackSvgOffsetBottom));
    },
    ACTION_CHANGE_tickInterval: function ACTION_CHANGE_tickInterval(tickInterval) {
      return dispatch((0, _actions.ACTION_CHANGE_tickInterval)(tickInterval));
    },
    ACTION_CHANGE_focusColor: function ACTION_CHANGE_focusColor(focusColor) {
      return dispatch((0, _actions.ACTION_CHANGE_focusColor)(focusColor));
    },
    ACTION_CHANGE_contextColor: function ACTION_CHANGE_contextColor(contextColor) {
      return dispatch((0, _actions.ACTION_CHANGE_contextColor)(contextColor));
    },
    ACTION_CHANGE_lockActiveColor: function ACTION_CHANGE_lockActiveColor(lockActiveColor) {
      return dispatch((0, _actions.ACTION_CHANGE_lockActiveColor)(lockActiveColor));
    },
    ACTION_CHANGE_lockInactiveColor: function ACTION_CHANGE_lockInactiveColor(lockInactiveColor) {
      return dispatch((0, _actions.ACTION_CHANGE_lockInactiveColor)(lockInactiveColor));
    },
    ACTION_CHANGE_dZoom: function ACTION_CHANGE_dZoom(dZoom) {
      return dispatch((0, _actions.ACTION_CHANGE_dZoom)(dZoom));
    },
    ACTION_CHANGE_applyContextEncodingsUniformly: function ACTION_CHANGE_applyContextEncodingsUniformly(applyContextEncodingsUniformly) {
      return dispatch((0, _actions.ACTION_CHANGE_applyContextEncodingsUniformly)(applyContextEncodingsUniformly));
    },
    ACTION_CHANGE_formatTrackHeader: function ACTION_CHANGE_formatTrackHeader(formatTrackHeader) {
      return dispatch((0, _actions.ACTION_CHANGE_formatTrackHeader)(formatTrackHeader));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(PeripheryPlotsContent);

exports["default"] = _default;
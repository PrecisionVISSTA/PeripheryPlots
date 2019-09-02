"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_state = {
  proposal: {
    id: -1
  }
};

function computePlotDimensions(numContextsPerSide, contextWidthRatio, baseWidth, containerPadding, axesWidth) {
  // The width for all focus + context plots within one track 
  var svgWidth = baseWidth - 2 * containerPadding - axesWidth; // The width for individual focuc and context plots 

  var contextWidth = svgWidth * contextWidthRatio;
  var focusWidth = svgWidth - contextWidth * numContextsPerSide * 2;
  return {
    contextWidth: contextWidth,
    focusWidth: focusWidth
  };
}

var mutations = {
  'CHANGE_timeExtentDomain': function CHANGE_timeExtentDomain(state, action) {
    var timeExtentDomain = action.timeExtentDomain;
    return _objectSpread({}, state, {
      timeExtentDomain: timeExtentDomain
    });
  },
  'CHANGE_timeDomains': function CHANGE_timeDomains(state, action) {
    var timeDomains = action.timeDomains;
    return _objectSpread({}, state, {
      timeDomains: timeDomains
    });
  },
  'CHANGE_numContextsPerSide': function CHANGE_numContextsPerSide(state, action) {
    var numContextsPerSide = action.numContextsPerSide;

    var _computePlotDimension = computePlotDimensions(numContextsPerSide, state.contextWidthRatio, state.baseWidth, state.containerPadding, state.axesWidth),
        focusWidth = _computePlotDimension.focusWidth,
        contextWidth = _computePlotDimension.contextWidth;

    return _objectSpread({}, state, {
      numContextsPerSide: numContextsPerSide,
      focusWidth: focusWidth,
      contextWidth: contextWidth
    });
  },
  'CHANGE_proposal ': function CHANGE_proposal(state, action) {
    var proposal = action.proposal;
    return _objectSpread({}, state, {
      proposal: proposal
    });
  },
  'CHANGE_baseWidth': function CHANGE_baseWidth(state, action) {
    var baseWidth = action.baseWidth;

    var _computePlotDimension2 = computePlotDimensions(state.numContextsPerSide, state.contextWidthRatio, baseWidth, state.containerPadding, state.axesWidth),
        focusWidth = _computePlotDimension2.focusWidth,
        contextWidth = _computePlotDimension2.contextWidth;

    return _objectSpread({}, state, {
      baseWidth: baseWidth,
      focusWidth: focusWidth,
      contextWidth: contextWidth
    });
  },
  'CHANGE_contextWidthRatio': function CHANGE_contextWidthRatio(state, action) {
    var contextWidthRatio = action.contextWidthRatio;

    var _computePlotDimension3 = computePlotDimensions(state.numContextsPerSide, contextWidthRatio, state.baseWidth, state.containerPadding, state.axesWidth),
        focusWidth = _computePlotDimension3.focusWidth,
        contextWidth = _computePlotDimension3.contextWidth;

    return _objectSpread({}, state, {
      contextWidthRatio: contextWidthRatio,
      focusWidth: focusWidth,
      contextWidth: contextWidth
    });
  },
  'CHANGE_containerPadding': function CHANGE_containerPadding(state, action) {
    var containerPadding = action.containerPadding;
    return _objectSpread({}, state, {
      containerPadding: containerPadding
    });
  },
  'CHANGE_controlTimelineHeight': function CHANGE_controlTimelineHeight(state, action) {
    var controlTimelineHeight = action.controlTimelineHeight;
    return _objectSpread({}, state, {
      controlTimelineHeight: controlTimelineHeight
    });
  },
  'CHANGE_verticalAlignerHeight': function CHANGE_verticalAlignerHeight(state, action) {
    var verticalAlignerHeight = action.verticalAlignerHeight;
    return _objectSpread({}, state, {
      verticalAlignerHeight: verticalAlignerHeight
    });
  },
  'CHANGE_axesWidth': function CHANGE_axesWidth(state, action) {
    var axesWidth = action.axesWidth;
    return _objectSpread({}, state, {
      axesWidth: axesWidth
    });
  },
  'CHANGE_trackHeight': function CHANGE_trackHeight(state, action) {
    var trackHeight = action.trackHeight;
    return _objectSpread({}, state, {
      trackHeight: trackHeight
    });
  },
  'CHANGE_trackSvgOffsetTop': function CHANGE_trackSvgOffsetTop(state, action) {
    var trackSvgOffsetTop = action.trackSvgOffsetTop;
    return _objectSpread({}, state, {
      trackSvgOffsetTop: trackSvgOffsetTop
    });
  },
  'CHANGE_trackSvgOffsetBottom': function CHANGE_trackSvgOffsetBottom(state, action) {
    var trackSvgOffsetBottom = action.trackSvgOffsetBottom;
    return _objectSpread({}, state, {
      trackSvgOffsetBottom: trackSvgOffsetBottom
    });
  },
  'CHANGE_tickInterval': function CHANGE_tickInterval(state, action) {
    var tickInterval = action.tickInterval;
    return _objectSpread({}, state, {
      tickInterval: tickInterval
    });
  },
  'CHANGE_focusColor': function CHANGE_focusColor(state, action) {
    var focusColor = action.focusColor;
    return _objectSpread({}, state, {
      focusColor: focusColor
    });
  },
  'CHANGE_contextColor': function CHANGE_contextColor(state, action) {
    var contextColor = action.contextColor;
    return _objectSpread({}, state, {
      contextColor: contextColor
    });
  },
  'CHANGE_lockActiveColor': function CHANGE_lockActiveColor(state, action) {
    var lockActiveColor = action.lockActiveColor;
    return _objectSpread({}, state, {
      lockActiveColor: lockActiveColor
    });
  },
  'CHANGE_lockInactiveColor': function CHANGE_lockInactiveColor(state, action) {
    var lockInactiveColor = action.lockInactiveColor;
    return _objectSpread({}, state, {
      lockInactiveColor: lockInactiveColor
    });
  },
  'CHANGE_dZoom': function CHANGE_dZoom(state, action) {
    var dZoom = action.dZoom;
    return _objectSpread({}, state, {
      dZoom: dZoom
    });
  },
  'CHANGE_applyContextEncodingsUniformly': function CHANGE_applyContextEncodingsUniformly(state, action) {
    var applyContextEncodingsUniformly = action.applyContextEncodingsUniformly;
    return _objectSpread({}, state, {
      applyContextEncodingsUniformly: applyContextEncodingsUniformly
    });
  },
  'CHANGE_formatTrackHeader': function CHANGE_formatTrackHeader(state, action) {
    var formatTrackHeader = action.formatTrackHeader;
    return _objectSpread({}, state, {
      formatTrackHeader: formatTrackHeader
    });
  },
  'CHANGE_msecsPadding': function CHANGE_msecsPadding(state, action) {
    var msecsPadding = action.msecsPadding;
    return _objectSpread({}, state, {
      msecsPadding: msecsPadding
    });
  }
};

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_state;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  // We opt for use of a mutator rather than a switch statement 
  // due to weird javascript restrictions on declaring the same variable
  // name across different cases. 
  var mutator = mutations[action.type];
  return mutator === undefined ? state : mutator(state, action);
};

var _default = reducer;
exports["default"] = _default;
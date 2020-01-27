"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_CHANGE_timeExtentDomain = ACTION_CHANGE_timeExtentDomain;
exports.ACTION_CHANGE_timeDomains = ACTION_CHANGE_timeDomains;
exports.ACTION_CHANGE_numContextsPerSide = ACTION_CHANGE_numContextsPerSide;
exports.ACTION_CHANGE_proposal = ACTION_CHANGE_proposal;
exports.ACTION_CHANGE_baseWidth = ACTION_CHANGE_baseWidth;
exports.ACTION_CHANGE_contextWidthRatio = ACTION_CHANGE_contextWidthRatio;
exports.ACTION_CHANGE_containerPadding = ACTION_CHANGE_containerPadding;
exports.ACTION_CHANGE_controlTimelineHeight = ACTION_CHANGE_controlTimelineHeight;
exports.ACTION_CHANGE_verticalAlignerHeight = ACTION_CHANGE_verticalAlignerHeight;
exports.ACTION_CHANGE_axesWidth = ACTION_CHANGE_axesWidth;
exports.ACTION_CHANGE_trackHeight = ACTION_CHANGE_trackHeight;
exports.ACTION_CHANGE_trackSvgOffsetTop = ACTION_CHANGE_trackSvgOffsetTop;
exports.ACTION_CHANGE_trackSvgOffsetBottom = ACTION_CHANGE_trackSvgOffsetBottom;
exports.ACTION_CHANGE_tickInterval = ACTION_CHANGE_tickInterval;
exports.ACTION_CHANGE_focusColor = ACTION_CHANGE_focusColor;
exports.ACTION_CHANGE_contextColor = ACTION_CHANGE_contextColor;
exports.ACTION_CHANGE_lockActiveColor = ACTION_CHANGE_lockActiveColor;
exports.ACTION_CHANGE_lockInactiveColor = ACTION_CHANGE_lockInactiveColor;
exports.ACTION_CHANGE_dZoom = ACTION_CHANGE_dZoom;
exports.ACTION_CHANGE_applyContextEncodingsUniformly = ACTION_CHANGE_applyContextEncodingsUniformly;
exports.ACTION_CHANGE_formatTrackHeader = ACTION_CHANGE_formatTrackHeader;
exports.ACTION_CHANGE_msecsPadding = ACTION_CHANGE_msecsPadding;
exports.ACTION_CHANGE_lockOutlineColor = ACTION_CHANGE_lockOutlineColor;
exports.ACTION_CHANGE_handleOutlineColor = ACTION_CHANGE_handleOutlineColor;
exports.ACTION_CHANGE_brushOutlineColor = ACTION_CHANGE_brushOutlineColor;
exports.ACTION_CHANGE_trackwiseObservations = ACTION_CHANGE_trackwiseObservations;
exports.ACTION_CHANGE_trackwiseTimeKeys = ACTION_CHANGE_trackwiseTimeKeys;
exports.ACTION_CHANGE_trackwiseValueKeys = ACTION_CHANGE_trackwiseValueKeys;
exports.ACTION_CHANGE_trackwiseTypes = ACTION_CHANGE_trackwiseTypes;
exports.ACTION_CHANGE_trackwiseUnits = ACTION_CHANGE_trackwiseUnits;
exports.ACTION_CHANGE_trackwiseNumAxisTicks = ACTION_CHANGE_trackwiseNumAxisTicks;
exports.ACTION_CHANGE_trackwiseAxisTickFormatters = ACTION_CHANGE_trackwiseAxisTickFormatters;
exports.ACTION_CHANGE_trackwiseEncodings = ACTION_CHANGE_trackwiseEncodings;
exports.ACTION_CHANGE_trackwiseValueDomainComputers = ACTION_CHANGE_trackwiseValueDomainComputers;
exports.ACTION_CHANGE_trackwiseAxes = ACTION_CHANGE_trackwiseAxes;
exports.ACTION_CHANGE_storeInit = ACTION_CHANGE_storeInit;
exports.ACTION_CHANGE_lockBounds = ACTION_CHANGE_lockBounds;

function ACTION_CHANGE_timeExtentDomain(timeExtentDomain) {
  return {
    type: 'CHANGE_timeExtentDomain',
    timeExtentDomain: timeExtentDomain
  };
}

;

function ACTION_CHANGE_timeDomains(timeDomains) {
  return {
    type: 'CHANGE_timeDomains',
    timeDomains: timeDomains
  };
}

;

function ACTION_CHANGE_numContextsPerSide(numContextsPerSide) {
  return {
    type: 'CHANGE_numContextsPerSide',
    numContextsPerSide: numContextsPerSide
  };
}

;

function ACTION_CHANGE_proposal(proposal) {
  return {
    type: 'CHANGE_proposal ',
    proposal: proposal
  };
}

;

function ACTION_CHANGE_baseWidth(baseWidth) {
  return {
    type: 'CHANGE_baseWidth',
    baseWidth: baseWidth
  };
}

;

function ACTION_CHANGE_contextWidthRatio(contextWidthRatio) {
  return {
    type: 'CHANGE_contextWidthRatio',
    contextWidthRatio: contextWidthRatio
  };
}

;

function ACTION_CHANGE_containerPadding(containerPadding) {
  return {
    type: 'CHANGE_containerPadding',
    containerPadding: containerPadding
  };
}

;

function ACTION_CHANGE_controlTimelineHeight(controlTimelineHeight) {
  return {
    type: 'CHANGE_controlTimelineHeight',
    controlTimelineHeight: controlTimelineHeight
  };
}

;

function ACTION_CHANGE_verticalAlignerHeight(verticalAlignerHeight) {
  return {
    type: 'CHANGE_verticalAlignerHeight',
    verticalAlignerHeight: verticalAlignerHeight
  };
}

;

function ACTION_CHANGE_axesWidth(axesWidth) {
  return {
    type: 'CHANGE_axesWidth',
    axesWidth: axesWidth
  };
}

;

function ACTION_CHANGE_trackHeight(trackHeight) {
  return {
    type: 'CHANGE_trackHeight',
    trackHeight: trackHeight
  };
}

;

function ACTION_CHANGE_trackSvgOffsetTop(trackSvgOffsetTop) {
  return {
    type: 'CHANGE_trackSvgOffsetTop',
    trackSvgOffsetTop: trackSvgOffsetTop
  };
}

;

function ACTION_CHANGE_trackSvgOffsetBottom(trackSvgOffsetBottom) {
  return {
    type: 'CHANGE_trackSvgOffsetBottom',
    trackSvgOffsetBottom: trackSvgOffsetBottom
  };
}

;

function ACTION_CHANGE_tickInterval(tickInterval) {
  return {
    type: 'CHANGE_tickInterval',
    tickInterval: tickInterval
  };
}

;

function ACTION_CHANGE_focusColor(focusColor) {
  return {
    type: 'CHANGE_focusColor',
    focusColor: focusColor
  };
}

;

function ACTION_CHANGE_contextColor(contextColor) {
  return {
    type: 'CHANGE_contextColor',
    contextColor: contextColor
  };
}

;

function ACTION_CHANGE_lockActiveColor(lockActiveColor) {
  return {
    type: 'CHANGE_lockActiveColor',
    lockActiveColor: lockActiveColor
  };
}

;

function ACTION_CHANGE_lockInactiveColor(lockInactiveColor) {
  return {
    type: 'CHANGE_lockInactiveColor',
    lockInactiveColor: lockInactiveColor
  };
}

;

function ACTION_CHANGE_dZoom(dZoom) {
  return {
    type: 'CHANGE_dZoom',
    dZoom: dZoom
  };
}

;

function ACTION_CHANGE_applyContextEncodingsUniformly(applyContextEncodingsUniformly) {
  return {
    type: 'CHANGE_applyContextEncodingsUniformly',
    applyContextEncodingsUniformly: applyContextEncodingsUniformly
  };
}

;

function ACTION_CHANGE_formatTrackHeader(formatTrackHeader) {
  return {
    type: 'CHANGE_formatTrackHeader',
    formatTrackHeader: formatTrackHeader
  };
}

;

function ACTION_CHANGE_msecsPadding(msecsPadding) {
  return {
    type: 'CHANGE_msecsPadding',
    msecsPadding: msecsPadding
  };
}

;

function ACTION_CHANGE_lockOutlineColor(lockOutlineColor) {
  return {
    type: 'CHANGE_lockOutlineColor',
    lockOutlineColor: lockOutlineColor
  };
}

;

function ACTION_CHANGE_handleOutlineColor(handleOutlineColor) {
  return {
    type: 'CHANGE_handleOutlineColor',
    handleOutlineColor: handleOutlineColor
  };
}

;

function ACTION_CHANGE_brushOutlineColor(brushOutlineColor) {
  return {
    type: 'CHANGE_brushOutlineColor',
    brushOutlineColor: brushOutlineColor
  };
}

;

function ACTION_CHANGE_trackwiseObservations(trackwiseObservations) {
  return {
    type: 'CHANGE_trackwiseObservations',
    trackwiseObservations: trackwiseObservations
  };
}

;

function ACTION_CHANGE_trackwiseTimeKeys(trackwiseTimeKeys) {
  return {
    type: 'CHANGE_trackwiseTimeKeys',
    trackwiseTimeKeys: trackwiseTimeKeys
  };
}

;

function ACTION_CHANGE_trackwiseValueKeys(trackwiseValueKeys) {
  return {
    type: 'CHANGE_trackwiseValueKeys',
    trackwiseValueKeys: trackwiseValueKeys
  };
}

;

function ACTION_CHANGE_trackwiseTypes(trackwiseTypes) {
  return {
    type: 'CHANGE_trackwiseTypes',
    trackwiseTypes: trackwiseTypes
  };
}

;

function ACTION_CHANGE_trackwiseUnits(trackwiseUnits) {
  return {
    type: 'CHANGE_trackwiseUnits',
    trackwiseUnits: trackwiseUnits
  };
}

;

function ACTION_CHANGE_trackwiseNumAxisTicks(trackwiseNumAxisTicks) {
  return {
    type: 'CHANGE_trackwiseNumAxisTicks',
    trackwiseNumAxisTicks: trackwiseNumAxisTicks
  };
}

;

function ACTION_CHANGE_trackwiseAxisTickFormatters(trackwiseAxisTickFormatters) {
  return {
    type: 'CHANGE_trackwiseAxisTickFormatters',
    trackwiseAxisTickFormatters: trackwiseAxisTickFormatters
  };
}

;

function ACTION_CHANGE_trackwiseEncodings(trackwiseEncodings) {
  return {
    type: 'CHANGE_trackwiseEncodings',
    trackwiseEncodings: trackwiseEncodings
  };
}

;

function ACTION_CHANGE_trackwiseValueDomainComputers(trackwiseValueDomainComputers) {
  return {
    type: 'CHANGE_trackwiseValueDomainComputers',
    trackwiseValueDomainComputers: trackwiseValueDomainComputers
  };
}

;

function ACTION_CHANGE_trackwiseAxes(trackwiseAxes) {
  return {
    type: 'CHANGE_trackwiseAxes',
    trackwiseAxes: trackwiseAxes
  };
}

;

function ACTION_CHANGE_storeInit(storeInit) {
  return {
    type: 'CHANGE_storeInit',
    storeInit: storeInit
  };
}

;

function ACTION_CHANGE_lockBounds(lockBounds) {
  return {
    type: 'CHANGE_lockBounds',
    lockBounds: lockBounds
  };
}
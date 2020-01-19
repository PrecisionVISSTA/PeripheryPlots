"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _d3Axis = require("d3-axis");

var _d3Scale = require("d3-scale");

var _d3Selection = require("d3-selection");

var _d3Zoom = require("d3-zoom");

var _d3Array = require("d3-array");

var _d3TimeFormat = require("d3-time-format");

var _reactRedux = require("react-redux");

var _util = require("../../util/util");

var _peripheryPlotContext = _interopRequireDefault(require("../../context/periphery-plot-context"));

var _actions = require("../../actions/actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Track =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Track, _React$Component);

  function Track(props) {
    var _this;

    _classCallCheck(this, Track);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Track).call(this, props)); // initialize a single zoom manager per container 

    _defineProperty(_assertThisInitialized(_this), "state", {
      axis: (0, _d3Axis.axisRight)(),
      quantitativeScale: (0, _d3Scale.scaleLinear)(),
      categoricalScale: (0, _d3Scale.scaleBand)(),
      timeScale: (0, _d3Scale.scaleTime)(),
      zooms: [],
      formatter: (0, _d3TimeFormat.timeFormat)('%B %d, %Y'),
      zoomsInitialized: false,
      lastK: 1,
      lastX: 0
    });

    _defineProperty(_assertThisInitialized(_this), "zoomed", function (index) {
      // ignore zoom-by-brush
      if (_d3Selection.event.sourceEvent && _d3Selection.event.sourceEvent.type === "brush") {
        return;
      }

      var _this$props = _this.props,
          dZoom = _this$props.dZoom,
          baseWidth = _this$props.baseWidth,
          timeDomains = _this$props.timeDomains,
          numContextsPerSide = _this$props.numContextsPerSide,
          controlScale = _this$props.controlScale,
          focusWidth = _this$props.focusWidth;
      var _this$state = _this.state,
          lastK = _this$state.lastK,
          lastX = _this$state.lastX,
          zoomRefs = _this$state.zoomRefs;
      var focusZone = timeDomains[numContextsPerSide];
      var zoomRef = zoomRefs[index];
      var zoomNode = (0, _d3Selection.select)(zoomRef).node();
      var transform = (0, _d3Zoom.zoomTransform)(zoomNode);
      var k = transform.k,
          x = transform.x;
      var isPan = lastK === k;
      var zoomDir = k > lastK ? -1 : 1;
      var newProposalId = Math.random();
      var shift = undefined;

      if (isPan) {
        var dx = lastX - x;
        var f = dx / baseWidth;

        var _focusZone = _slicedToArray(focusZone, 2),
            d0 = _focusZone[0],
            d1 = _focusZone[1];

        var temporalWidth = (d1.valueOf() - d0.valueOf()) * f;
        var dleft = d0;
        var dright = new Date(d0.valueOf() + temporalWidth);
        var pleft = controlScale(dleft);
        var pright = controlScale(dright);
        var pshift = pright - pleft;
        shift = pshift;
      }

      var proposal = {
        id: newProposalId,
        index: index,
        type: isPan ? 'pan' : 'zoom',
        shift: shift,
        dr: !isPan ? zoomDir * dZoom : undefined,
        dl: !isPan ? -zoomDir * dZoom : undefined
      };

      if (isPan && lastX !== x || lastK !== k) {
        _this.setState({
          lastK: k,
          lastX: x,
          proposalId: newProposalId
        });

        _this.props.ACTION_CHANGE_proposal(proposal);
      }

      _this.updateTooltip();
    });

    _defineProperty(_assertThisInitialized(_this), "updateTooltip", function () {
      var _this$props2 = _this.props,
          focusWidth = _this$props2.focusWidth,
          numContextsPerSide = _this$props2.numContextsPerSide,
          contextWidth = _this$props2.contextWidth,
          trackWidth = _this$props2.trackWidth,
          timeDomains = _this$props2.timeDomains;
      var _this$state2 = _this.state,
          formatter = _this$state2.formatter,
          timeScale = _this$state2.timeScale;

      var _mouse = (0, _d3Selection.mouse)(_this.FOCUS_REF),
          _mouse2 = _slicedToArray(_mouse, 2),
          x = _mouse2[0],
          y = _mouse2[1];

      (0, _d3Selection.selectAll)('.focus-time-bar').attr('transform', "translate(".concat(x, ",0)"));
      var currentDate = timeScale.domain(timeDomains[numContextsPerSide]).range([0, focusWidth]).invert(x);
      var dateString = formatter(currentDate);
      var containerNode = (0, _d3Selection.select)(_this.FOCUS_REF).node();
      (0, _d3Selection.selectAll)('.focus-time-text').each(function (d, i) {
        var parentNode = this.parentNode;

        if (parentNode.isEqualNode(containerNode)) {
          var textS = (0, _d3Selection.select)(this).text(dateString);
          var textBbox = this.getBBox();
          var textW = textBbox.width;
          var propBbox = [x - textW / 2, x + textW / 2];

          if (propBbox[0] < 0) {
            propBbox = propBbox.map(function (v) {
              return v + -propBbox[0];
            });
          } else if (propBbox[1] > focusWidth) {
            propBbox = propBbox.map(function (v) {
              return v + -(propBbox[1] - focusWidth);
            });
          }

          var newX = (propBbox[1] + propBbox[0]) / 2;
          textS.attr('display', 'block').attr('transform', "translate(".concat(newX, ",10)"));
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "removeTooltip", function () {
      (0, _d3Selection.selectAll)('.focus-time-bar').attr('transform', "translate(".concat(-1, ",0)"));
      (0, _d3Selection.selectAll)('.focus-time-text').attr('display', 'none');
    });

    var numCharts = _this.props.numContextsPerSide * 2 + 1;
    _this.state.zooms = _lodash["default"].range(0, numCharts).map(function (i) {
      return (0, _d3Zoom.zoom)();
    });
    _this.state.zoomRefs = _lodash["default"].range(0, numCharts).map(function (i) {
      return null;
    }); // populate with refs during render 

    return _this;
  }

  _createClass(Track, [{
    key: "initZoom",
    value: function initZoom() {
      var numContextsPerSide = this.props.numContextsPerSide;
      var _this$state3 = this.state,
          zooms = _this$state3.zooms,
          zoomRefs = _this$state3.zoomRefs;
      var numCharts = numContextsPerSide * 2 + 1;

      for (var i = 0; i < numCharts; i++) {
        var zoomCallback = _lodash["default"].partial(this.zoomed, i);

        var zoomTarget = (0, _d3Selection.select)(zoomRefs[i]);
        var zoomFn = zooms[i];
        zoomTarget.call(zoomFn.on('zoom', zoomCallback));
      }
    }
  }, {
    key: "updateAxes",
    value: function updateAxes() {
      var _this$state4 = this.state,
          axis = _this$state4.axis,
          quantitativeScale = _this$state4.quantitativeScale,
          categoricalScale = _this$state4.categoricalScale;
      var _this$props3 = this.props,
          trackHeight = _this$props3.trackHeight,
          trackSvgOffsetTop = _this$props3.trackSvgOffsetTop,
          trackSvgOffsetBottom = _this$props3.trackSvgOffsetBottom,
          type = _this$props3.type,
          numAxisTicks = _this$props3.numAxisTicks,
          axisTickFormatter = _this$props3.axisTickFormatter;

      if (axisTickFormatter) {
        axis.tickFormat(axisTickFormatter);
      }

      var scale;
      var applyScaleToAxis;

      switch (type) {
        case 'discrete':
          scale = categoricalScale;

          applyScaleToAxis = function applyScaleToAxis(scale) {
            return axis.scale(scale);
          };

          break;

        case 'continuous':
          scale = quantitativeScale;

          applyScaleToAxis = function applyScaleToAxis(scale) {
            return axis.scale(scale.nice()).ticks(numAxisTicks ? numAxisTicks : 4);
          };

          break;

        case 'other':
          break;
      }

      if (type !== 'other') {
        applyScaleToAxis(scale.domain(this.computeValueDomain(this.props)).range([trackHeight - trackSvgOffsetBottom - 1, trackSvgOffsetTop]));
        (0, _d3Selection.select)(this.AXES_REF).call(axis).selectAll('text').classed('pplot-track-axis-text', true);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateAxes();
      this.initZoom();
      (0, _d3Selection.select)(this.FOCUS_REF).on('mousemove', this.updateTooltip);
      (0, _d3Selection.select)(this.FOCUS_REF).on('mouseleave', this.removeTooltip);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      this.updateAxes();
    }
  }, {
    key: "computeValueDomain",
    value: function computeValueDomain(props) {
      var observations = props.observations,
          valueDomainComputer = props.valueDomainComputer,
          valueKey = props.valueKey,
          type = props.type;

      var computeContinuousValueDomain = function computeContinuousValueDomain(observations) {
        // returns [0, max value]
        var _extent = (0, _d3Array.extent)(observations.map(function (o) {
          return o[valueKey];
        })),
            _extent2 = _slicedToArray(_extent, 2),
            e0 = _extent2[0],
            e1 = _extent2[1];

        return [0, e1];
      };

      var computeDiscreteValueDomain = function computeDiscreteValueDomain(observations) {
        // gets all categorical values for discrete domain 
        return _lodash["default"].sortBy(_lodash["default"].uniq(observations.map(function (o) {
          return o[valueKey];
        })), function (d) {
          return d;
        });
      };

      var valueDomain = valueDomainComputer ? valueDomainComputer(observations) : type === 'continuous' ? computeContinuousValueDomain(observations) : type === 'discrete' ? computeDiscreteValueDomain(observations) : null;
      return valueDomain;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          unit = _this$props4.unit,
          observations = _this$props4.observations,
          timeKey = _this$props4.timeKey,
          valueKey = _this$props4.valueKey,
          timeDomains = _this$props4.timeDomains,
          numContextsPerSide = _this$props4.numContextsPerSide,
          trackHeight = _this$props4.trackHeight,
          trackSvgOffsetTop = _this$props4.trackSvgOffsetTop,
          trackSvgOffsetBottom = _this$props4.trackSvgOffsetBottom,
          axesWidth = _this$props4.axesWidth,
          focusColor = _this$props4.focusColor,
          contextColor = _this$props4.contextColor,
          containerPadding = _this$props4.containerPadding,
          focusWidth = _this$props4.focusWidth,
          contextWidth = _this$props4.contextWidth,
          baseWidth = _this$props4.baseWidth,
          applyContextEncodingsUniformly = _this$props4.applyContextEncodingsUniformly,
          type = _this$props4.type,
          formatTrackHeader = _this$props4.formatTrackHeader,
          msecsPadding = _this$props4.msecsPadding,
          encodings = _this$props4.encodings,
          valueDomainComputer = _this$props4.valueDomainComputer;
      var zoomRefs = this.state.zoomRefs; // utility functions 

      var valueInDomain = function valueInDomain(value, domain) {
        return value >= domain[0] && value <= domain[1];
      };

      var observationsInDomain = function observationsInDomain(domain) {
        return observations.filter(function (o) {
          return valueInDomain(o[timeKey], domain);
        });
      }; // Indices for zoom and ref objects 


      var leftIndices = _lodash["default"].range(0, numContextsPerSide);

      var focusIndex = numContextsPerSide;

      var rightIndices = _lodash["default"].range(numContextsPerSide + 1, numContextsPerSide * 2 + 1); // partitioned domains 


      var leftContextTimeDomains = timeDomains.slice(0, numContextsPerSide);
      var focusTimeDomain = timeDomains[numContextsPerSide];
      var rightContextTimeDomains = timeDomains.slice(numContextsPerSide + 1, timeDomains.length); // partitioned encodings

      var leftContextEncodings = applyContextEncodingsUniformly ? [encodings[0]] : encodings.slice(0, numContextsPerSide);
      var FocusEncoding = encodings[Math.floor(encodings.length / 2)];
      var rightContextEncodings = applyContextEncodingsUniformly ? [encodings[2]] : encodings.slice(numContextsPerSide + 1, encodings.length); // partitioned observations

      var padDomain = _lodash["default"].partial(_util.padDateRange, msecsPadding);

      var leftContextObservations = leftContextTimeDomains.map(padDomain).map(observationsInDomain);
      var focusObservations = observationsInDomain(padDomain(focusTimeDomain));
      var rightContextObservations = rightContextTimeDomains.map(padDomain).map(observationsInDomain);
      var contextXRange = [0, contextWidth];
      var contextYRange = [trackHeight - trackSvgOffsetBottom, trackSvgOffsetTop];
      var focusXRange = [0, focusWidth];
      var focusYRange = [trackHeight - trackSvgOffsetBottom, trackSvgOffsetTop];

      var contextScaleRangeToBox = _lodash["default"].partial(_util.scaleRangeToBox, contextXRange, contextYRange);

      var focusScaleRangeToBox = _lodash["default"].partial(_util.scaleRangeToBox, focusXRange, focusYRange);

      var tHeight = trackHeight - trackSvgOffsetTop - trackSvgOffsetBottom;
      var valueDomain = this.computeValueDomain(this.props);

      var getAllObservations = function getAllObservations() {
        return observations;
      }; // namespace for periphery plot properties 


      var pplot = {
        timeKey: timeKey,
        valueKey: valueKey,
        valueDomain: valueDomain,
        getAllObservations: getAllObservations,
        unit: unit
      };
      return _react["default"].createElement("div", {
        style: {
          width: baseWidth,
          paddingLeft: containerPadding,
          paddingRight: containerPadding,
          boxSizing: 'content-box'
        }
      }, _react["default"].createElement("div", {
        className: 'pplot-track-header-text-container',
        style: {
          width: "100%",
          display: "block"
        }
      }, _react["default"].createElement("p", {
        className: 'pplot-track-header-text'
      }, formatTrackHeader(valueKey, unit))), _react["default"].createElement("svg", {
        className: "pplot-axis",
        ref: function ref(_ref) {
          return _this2.AXES_REF = _ref;
        },
        style: {
          width: axesWidth,
          height: trackHeight,
          "float": 'left'
        }
      }), leftContextTimeDomains.map(function (timeDomain, i) {
        var LeftContextEncoding = applyContextEncodingsUniformly ? leftContextEncodings[0] : leftContextEncodings[i];
        var clipId = "left-clip-".concat(i);
        var pplotLeft = Object.assign({}, pplot);
        var observations = leftContextObservations[i];
        var index = leftIndices[i];
        pplotLeft = Object.assign(pplotLeft, {
          observations: observations,
          timeDomain: timeDomain,
          xRange: contextXRange,
          yRange: contextYRange,
          isLeft: true,
          scaleRangeToBox: contextScaleRangeToBox
        });
        return _react["default"].createElement("svg", {
          key: "left-".concat(i),
          clipPath: "url(#".concat(clipId, ")"),
          style: {
            width: contextWidth,
            height: trackHeight,
            display: 'inline-block',
            "float": 'left'
          }
        }, _react["default"].createElement("defs", null, _react["default"].createElement("clipPath", {
          id: clipId
        }, _react["default"].createElement("rect", {
          x: 0,
          y: trackSvgOffsetTop,
          width: contextWidth,
          height: tHeight
        }))), _react["default"].createElement("rect", {
          x: 0,
          y: trackSvgOffsetTop,
          width: contextWidth,
          height: tHeight,
          stroke: contextColor,
          fill: "none"
        }), LeftContextEncoding.map(function (LayeredEncoding, j) {
          return _react["default"].createElement(LayeredEncoding, {
            key: "left-".concat(i, "-").concat(j, "-inner"),
            pplot: pplotLeft
          });
        }), _react["default"].createElement("rect", {
          ref: function ref(_ref2) {
            return zoomRefs[index] = _ref2;
          },
          className: "zoom",
          pointerEvents: "all",
          x: 0,
          y: trackSvgOffsetTop,
          width: contextWidth,
          height: tHeight,
          fill: "none"
        }));
      }), _react["default"].createElement("svg", {
        className: "periphery-plots-focus",
        ref: function ref(_ref4) {
          return _this2.FOCUS_REF = _ref4;
        },
        style: {
          width: focusWidth,
          height: trackHeight,
          display: 'inline-block',
          "float": 'left'
        }
      }, _react["default"].createElement("defs", null, _react["default"].createElement("clipPath", {
        id: "focus-clip"
      }, _react["default"].createElement("rect", {
        x: 0,
        y: trackSvgOffsetTop,
        width: focusWidth,
        height: tHeight
      }))), _react["default"].createElement("g", {
        clipPath: "url(#focus-clip)"
      }, _react["default"].createElement("rect", {
        x: 0,
        y: trackSvgOffsetTop,
        width: focusWidth,
        height: tHeight,
        stroke: focusColor,
        fill: "none"
      }), _react["default"].createElement("rect", {
        className: "focus-time-bar",
        x: 0,
        y: trackSvgOffsetTop + 1,
        width: .1,
        height: tHeight - 2,
        stroke: "#515151"
      }), FocusEncoding.map(function (LayeredEncoding, j) {
        return _react["default"].createElement(LayeredEncoding, {
          key: "focus-".concat(j),
          pplot: Object.assign(Object.assign({}, pplot), {
            observations: focusObservations,
            timeDomain: focusTimeDomain,
            xRange: focusXRange,
            yRange: focusYRange,
            scaleRangeToBox: focusScaleRangeToBox,
            isFocus: true
          })
        });
      }), _react["default"].createElement("rect", {
        ref: function ref(_ref3) {
          return zoomRefs[focusIndex] = _ref3;
        },
        className: "zoom",
        pointerEvents: "all",
        x: 0,
        y: trackSvgOffsetTop,
        width: focusWidth,
        height: tHeight,
        fill: "none"
      })), _react["default"].createElement("text", {
        className: "focus-time-text",
        x: 0,
        y: -2,
        fontFamily: 'Helvetica',
        fill: 'black',
        stroke: 'white',
        strokeWidth: .2,
        fontSize: 8,
        textAnchor: "middle"
      })), rightContextTimeDomains.map(function (timeDomain, i) {
        var RightContextEncoding = applyContextEncodingsUniformly ? rightContextEncodings[0] : rightContextEncodings[i];
        var clipId = "right-clip-".concat(i);
        var observations = rightContextObservations[i];
        var pplotRight = Object.assign({}, pplot);
        var index = rightIndices[i];
        pplotRight = Object.assign(pplot, {
          observations: observations,
          timeDomain: timeDomain,
          xRange: contextXRange,
          yRange: contextYRange,
          scaleRangeToBox: contextScaleRangeToBox
        });
        return _react["default"].createElement("svg", {
          key: "right-".concat(i),
          clipPath: "url(#".concat(clipId, ")"),
          style: {
            width: contextWidth,
            height: trackHeight,
            display: 'inline-block',
            "float": 'left'
          }
        }, _react["default"].createElement("defs", null, _react["default"].createElement("clipPath", {
          id: clipId
        }, _react["default"].createElement("rect", {
          x: 0,
          y: trackSvgOffsetTop,
          width: contextWidth,
          height: tHeight
        }))), _react["default"].createElement("rect", {
          x: 0,
          y: trackSvgOffsetTop,
          width: contextWidth,
          height: tHeight,
          stroke: contextColor,
          fill: "none"
        }), RightContextEncoding.map(function (LayeredEncoding, j) {
          return _react["default"].createElement(LayeredEncoding, {
            key: "right-".concat(i, "-").concat(j, "-inner"),
            pplot: pplotRight
          });
        }), _react["default"].createElement("rect", {
          ref: function ref(_ref5) {
            return zoomRefs[index] = _ref5;
          },
          className: "zoom",
          pointerEvents: "all",
          x: 0,
          y: trackSvgOffsetTop,
          width: contextWidth,
          height: tHeight,
          fill: "none"
        }));
      }));
    }
  }]);

  return Track;
}(_react["default"].Component);

;

var mapStateToProps = function mapStateToProps(_ref6) {
  var timeDomains = _ref6.timeDomains,
      focusColor = _ref6.focusColor,
      contextColor = _ref6.contextColor,
      containerPadding = _ref6.containerPadding,
      focusWidth = _ref6.focusWidth,
      contextWidth = _ref6.contextWidth,
      trackWidth = _ref6.trackWidth,
      trackHeight = _ref6.trackHeight,
      trackSvgOffsetTop = _ref6.trackSvgOffsetTop,
      trackSvgOffsetBottom = _ref6.trackSvgOffsetBottom,
      axesWidth = _ref6.axesWidth,
      numContextsPerSide = _ref6.numContextsPerSide,
      baseWidth = _ref6.baseWidth,
      dZoom = _ref6.dZoom,
      applyContextEncodingsUniformly = _ref6.applyContextEncodingsUniformly,
      formatTrackHeader = _ref6.formatTrackHeader,
      msecsPadding = _ref6.msecsPadding,
      controlScale = _ref6.controlScale;
  return {
    timeDomains: timeDomains,
    focusColor: focusColor,
    contextColor: contextColor,
    containerPadding: containerPadding,
    focusWidth: focusWidth,
    contextWidth: contextWidth,
    trackWidth: trackWidth,
    trackHeight: trackHeight,
    trackSvgOffsetTop: trackSvgOffsetTop,
    trackSvgOffsetBottom: trackSvgOffsetBottom,
    axesWidth: axesWidth,
    numContextsPerSide: numContextsPerSide,
    baseWidth: baseWidth,
    dZoom: dZoom,
    applyContextEncodingsUniformly: applyContextEncodingsUniformly,
    formatTrackHeader: formatTrackHeader,
    msecsPadding: msecsPadding,
    controlScale: controlScale
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    ACTION_CHANGE_proposal: function ACTION_CHANGE_proposal(proposal) {
      return dispatch((0, _actions.ACTION_CHANGE_proposal)(proposal));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, null, {
  context: _peripheryPlotContext["default"]
})(Track);

exports["default"] = _default;
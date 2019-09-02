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

  function Track() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Track);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Track)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      axis: (0, _d3Axis.axisRight)(),
      quantitativeScale: (0, _d3Scale.scaleLinear)(),
      categoricalScale: (0, _d3Scale.scaleBand)(),
      timeScale: (0, _d3Scale.scaleTime)(),
      zoom: (0, _d3Zoom.zoom)(),
      formatter: (0, _d3TimeFormat.timeFormat)('%B %d, %Y'),
      zoomsInitialized: false,
      proposalId: 0,
      lastK: 1,
      lastX: 0
    });

    _defineProperty(_assertThisInitialized(_this), "zoomed", function () {
      // ignore zoom-by-brush
      if (_d3Selection.event.sourceEvent && _d3Selection.event.sourceEvent.type === "brush") {
        return;
      }

      var dZoom = _this.props.dZoom;
      var _this$state = _this.state,
          lastK = _this$state.lastK,
          lastX = _this$state.lastX,
          proposalId = _this$state.proposalId;

      var _zoomTransform = (0, _d3Zoom.zoomTransform)((0, _d3Selection.select)(_this.ZOOM_REF).node()),
          k = _zoomTransform.k,
          x = _zoomTransform.x;

      var isPan = lastK === k;
      var zoomDir = k > lastK ? -1 : 1;
      var newProposalId = proposalId + 1;
      var proposal = {
        id: proposalId + 1,
        type: isPan ? 'pan' : 'zoom',
        shift: isPan ? x - lastX : undefined,
        dl: !isPan ? zoomDir * dZoom : undefined,
        dr: !isPan ? -zoomDir * dZoom : undefined
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
      var _this$props = _this.props,
          focusWidth = _this$props.focusWidth,
          numContextsPerSide = _this$props.numContextsPerSide,
          contextWidth = _this$props.contextWidth,
          trackWidth = _this$props.trackWidth,
          timeDomains = _this$props.timeDomains;
      var _this$state2 = _this.state,
          formatter = _this$state2.formatter,
          timeScale = _this$state2.timeScale;

      var _mouse = (0, _d3Selection.mouse)(_this.FOCUS_REF),
          _mouse2 = _slicedToArray(_mouse, 2),
          x = _mouse2[0],
          y = _mouse2[1];

      (0, _d3Selection.selectAll)('.focus-time-bar').attr('transform', "translate(".concat(x, ",0)")); // True if mouse in left half of container 

      var toLeft = x < focusWidth / 2;
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

    return _this;
  }

  _createClass(Track, [{
    key: "initZoom",
    value: function initZoom() {
      (0, _d3Selection.select)(this.ZOOM_REF).call(this.state.zoom.on("zoom", this.zoomed));
    }
  }, {
    key: "updateAxes",
    value: function updateAxes() {
      var _this$state3 = this.state,
          axis = _this$state3.axis,
          quantitativeScale = _this$state3.quantitativeScale,
          categoricalScale = _this$state3.categoricalScale;
      var _this$props2 = this.props,
          observations = _this$props2.observations,
          valueKey = _this$props2.valueKey,
          trackHeight = _this$props2.trackHeight,
          trackSvgOffsetTop = _this$props2.trackSvgOffsetTop,
          trackSvgOffsetBottom = _this$props2.trackSvgOffsetBottom,
          type = _this$props2.type,
          numAxisTicks = _this$props2.numAxisTicks,
          axisTickFormatter = _this$props2.axisTickFormatter;

      if (axisTickFormatter) {
        axis.tickFormat(axisTickFormatter);
      }

      var valueDomain;
      var scale;
      var applyScaleToAxis;

      switch (type) {
        case 'discrete':
          valueDomain = _lodash["default"].sortBy(_lodash["default"].uniq(observations.map(function (o) {
            return o[valueKey];
          })), function (d) {
            return d;
          });
          scale = categoricalScale;

          applyScaleToAxis = function applyScaleToAxis(scale) {
            return axis.scale(scale);
          };

          break;

        case 'continuous':
          valueDomain = (0, _d3Array.extent)(observations.map(function (o) {
            return o[valueKey];
          }));
          scale = quantitativeScale;

          applyScaleToAxis = function applyScaleToAxis(scale) {
            return axis.scale(scale.nice()).ticks(numAxisTicks ? numAxisTicks : 4);
          };

          break;

        case 'other':
          break;
      }

      if (type !== 'other') {
        applyScaleToAxis(scale.domain(valueDomain).range([trackHeight - trackSvgOffsetBottom - 1, trackSvgOffsetTop]));
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
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          unit = _this$props3.unit,
          observations = _this$props3.observations,
          timeKey = _this$props3.timeKey,
          valueKey = _this$props3.valueKey,
          timeDomains = _this$props3.timeDomains,
          numContextsPerSide = _this$props3.numContextsPerSide,
          encodings = _this$props3.encodings,
          trackHeight = _this$props3.trackHeight,
          trackSvgOffsetTop = _this$props3.trackSvgOffsetTop,
          trackSvgOffsetBottom = _this$props3.trackSvgOffsetBottom,
          axesWidth = _this$props3.axesWidth,
          focusColor = _this$props3.focusColor,
          contextColor = _this$props3.contextColor,
          containerPadding = _this$props3.containerPadding,
          focusWidth = _this$props3.focusWidth,
          contextWidth = _this$props3.contextWidth,
          baseWidth = _this$props3.baseWidth,
          applyContextEncodingsUniformly = _this$props3.applyContextEncodingsUniformly,
          type = _this$props3.type,
          formatTrackHeader = _this$props3.formatTrackHeader,
          msecsPadding = _this$props3.msecsPadding; // utility functions 

      var valueInDomain = function valueInDomain(value, domain) {
        return value >= domain[0] && value <= domain[1];
      };

      var observationsInDomain = function observationsInDomain(domain) {
        return observations.filter(function (o) {
          return valueInDomain(o[timeKey], domain);
        });
      }; // partitioned domains 


      var leftContextTimeDomains = timeDomains.slice(0, numContextsPerSide);
      var focusTimeDomain = timeDomains[numContextsPerSide];
      var rightContextTimeDomains = timeDomains.slice(numContextsPerSide + 1, timeDomains.length); // partitioned encodings

      var leftContextEncodings = encodings.slice(0, numContextsPerSide);
      var FocusEncoding = encodings[numContextsPerSide];
      var rightContextEncodings = encodings.slice(numContextsPerSide + 1, encodings.length); // partitioned observations

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
      var valueDomain = type === 'continuous' ? (0, _d3Array.extent)(observations.map(function (o) {
        return o[valueKey];
      })) : type === 'discrete' ? _lodash["default"].sortBy(_lodash["default"].uniq(observations.map(function (o) {
        return o[valueKey];
      })), function (d) {
        return d;
      }) : null;

      var getAllObservations = function getAllObservations() {
        return observations;
      }; // namespace for periphery plot specific properties 


      var pplot = {
        timeKey: timeKey,
        valueKey: valueKey,
        valueDomain: valueDomain,
        getAllObservations: getAllObservations
      };
      return _react["default"].createElement("div", {
        style: {
          width: baseWidth,
          paddingLeft: containerPadding,
          paddingRight: containerPadding
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
        }));
      }), _react["default"].createElement("svg", {
        ref: function ref(_ref3) {
          return _this2.FOCUS_REF = _ref3;
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
        className: "focus-time-bar",
        x: 0,
        y: trackSvgOffsetTop + 1,
        width: .1,
        height: tHeight - 2,
        stroke: "#515151"
      }), _react["default"].createElement("rect", {
        ref: function ref(_ref2) {
          return _this2.ZOOM_REF = _ref2;
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
        }));
      }));
    }
  }]);

  return Track;
}(_react["default"].Component);

var mapStateToProps = function mapStateToProps(_ref4) {
  var timeDomains = _ref4.timeDomains,
      timeExtentDomain = _ref4.timeExtentDomain,
      focusColor = _ref4.focusColor,
      contextColor = _ref4.contextColor,
      containerPadding = _ref4.containerPadding,
      focusWidth = _ref4.focusWidth,
      contextWidth = _ref4.contextWidth,
      trackWidth = _ref4.trackWidth,
      trackHeight = _ref4.trackHeight,
      trackSvgOffsetTop = _ref4.trackSvgOffsetTop,
      trackSvgOffsetBottom = _ref4.trackSvgOffsetBottom,
      axesWidth = _ref4.axesWidth,
      numContextsPerSide = _ref4.numContextsPerSide,
      baseWidth = _ref4.baseWidth,
      dZoom = _ref4.dZoom,
      applyContextEncodingsUniformly = _ref4.applyContextEncodingsUniformly,
      formatTrackHeader = _ref4.formatTrackHeader,
      msecsPadding = _ref4.msecsPadding;
  return {
    timeDomains: timeDomains,
    timeExtentDomain: timeExtentDomain,
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
    msecsPadding: msecsPadding
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    ACTION_CHANGE_proposal: function ACTION_CHANGE_proposal(proposal) {
      return dispatch((0, _actions.ACTION_CHANGE_proposal)(proposal));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Track);

exports["default"] = _default;
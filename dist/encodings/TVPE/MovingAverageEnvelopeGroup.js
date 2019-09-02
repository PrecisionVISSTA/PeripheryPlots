"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Scale = require("d3-scale");

var _d3Shape = require("d3-shape");

var _d3Array = require("d3-array");

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

var WINDOW_SIZE_MS = 86400 * 1000 * 10;
var WINDOW_SLIDE_MS = 86400 * 1000 * 2;
var ENVELOPE_PADDING = 0;

var MovingAverageEnvelopeGroup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MovingAverageEnvelopeGroup, _React$Component);

  function MovingAverageEnvelopeGroup() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MovingAverageEnvelopeGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MovingAverageEnvelopeGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      timeScale: (0, _d3Scale.scaleTime)(),
      valueScale: (0, _d3Scale.scaleLinear)(),
      area: (0, _d3Shape.area)().curve(_d3Shape.curveBasis)
    });

    return _this;
  }

  _createClass(MovingAverageEnvelopeGroup, [{
    key: "computeEnvelope",
    value: function computeEnvelope(observations, timeKey, valueKey) {
      var dates = observations.map(function (d) {
        return d[timeKey];
      }).map(function (d) {
        return d.valueOf();
      });
      var values = observations.map(function (d) {
        return d[valueKey];
      });

      var _extent$map = (0, _d3Array.extent)(dates).map(function (d) {
        return d.valueOf();
      }),
          _extent$map2 = _slicedToArray(_extent$map, 2),
          min_ms = _extent$map2[0],
          max_ms = _extent$map2[1];

      var envelope = [];
      var wsstart = min_ms;
      var wsend = min_ms + WINDOW_SIZE_MS;

      while (wsstart < wsend) {
        var ws = wsstart;
        var we = ws + WINDOW_SIZE_MS;
        var di = 0;

        while (we <= max_ms) {
          while (dates[di] < ws) {
            di++;
          }

          var wvalues = [];

          while (dates[di] <= we) {
            wvalues.push(values[di++]);
          }

          var date = ws + WINDOW_SIZE_MS / 2;

          if (wvalues.length > 0) {
            var _extent = (0, _d3Array.extent)(wvalues),
                _extent2 = _slicedToArray(_extent, 2),
                lower = _extent2[0],
                upper = _extent2[1];

            envelope.push({
              date: new Date(date),
              lower: lower * (1 - ENVELOPE_PADDING),
              upper: upper * (1 + ENVELOPE_PADDING)
            });
          }

          ws += WINDOW_SIZE_MS;
          we += WINDOW_SIZE_MS;
        }

        wsstart += WINDOW_SLIDE_MS;
      } // Ensure points defining envelope are in correct order as the above 
      // loop does not construct the envelope in order 


      envelope = _.sortBy(envelope, function (d) {
        return d[timeKey];
      });
      return envelope;
    }
  }, {
    key: "render",
    value: function render() {
      var pplot = this.props.pplot;
      var timeKey = pplot.timeKey,
          valueKey = pplot.valueKey,
          timeDomain = pplot.timeDomain,
          valueDomain = pplot.valueDomain,
          observations = pplot.observations,
          scaleRangeToBox = pplot.scaleRangeToBox;
      var _this$state = this.state,
          timeScale = _this$state.timeScale,
          valueScale = _this$state.valueScale,
          area = _this$state.area;
      var scales = scaleRangeToBox(timeScale, valueScale);
      timeScale = scales.xScale;
      valueScale = scales.yScale;
      timeScale.domain(timeDomain);
      valueScale.domain(valueDomain);
      area.x(function (d) {
        return timeScale(d.date);
      }).y0(function (d) {
        return valueScale(d.lower);
      }).y1(function (d) {
        return valueScale(d.upper);
      });
      var envelope = this.computeEnvelope(observations, timeKey, valueKey);
      return _react["default"].createElement("g", null, _react["default"].createElement("path", {
        d: area(envelope),
        fill: "grey"
      }));
    }
  }]);

  return MovingAverageEnvelopeGroup;
}(_react["default"].Component);

var _default = MovingAverageEnvelopeGroup;
exports["default"] = _default;
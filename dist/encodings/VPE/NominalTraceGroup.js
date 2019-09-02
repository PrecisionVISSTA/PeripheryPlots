"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Scale = require("d3-scale");

var _d3ScaleChromatic = require("d3-scale-chromatic");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NominalTraceGroup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(NominalTraceGroup, _React$Component);

  function NominalTraceGroup() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, NominalTraceGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(NominalTraceGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      valueScale: (0, _d3Scale.scaleBand)(),
      freqScale: (0, _d3Scale.scaleLinear)(),
      colors: _d3ScaleChromatic.schemeCategory10
    });

    return _this;
  }

  _createClass(NominalTraceGroup, [{
    key: "render",
    value: function render() {
      var pplot = this.props.pplot;
      var valueKey = pplot.valueKey,
          valueDomain = pplot.valueDomain,
          observations = pplot.observations,
          scaleRangeToBox = pplot.scaleRangeToBox,
          xRange = pplot.xRange,
          yRange = pplot.yRange,
          isLeft = pplot.isLeft;
      var _this$state = this.state,
          freqScale = _this$state.freqScale,
          valueScale = _this$state.valueScale,
          colors = _this$state.colors;
      var scales = scaleRangeToBox(freqScale, valueScale);
      freqScale = scales.xScale;
      valueScale = scales.yScale;
      freqScale.domain([0, 1.0]);
      valueScale.domain(valueDomain);
      var binHeight = 5;
      var observationCounts = observations.reduce(function (acc, cur) {
        var value = cur[valueKey];
        acc[value] = acc[value] === undefined ? 1 : acc[value] + 1;
        return acc;
      }, {});
      var xWidth = xRange[1] - xRange[0];
      var tx = xRange[0];
      var ty = yRange[1];
      return _react["default"].createElement("g", {
        transform: isLeft ? "translate(".concat(xWidth + tx, ",").concat(ty, ") scale(-1,1) translate(").concat(-tx, ",").concat(-ty, ")") : ''
      }, valueDomain.map(function (value, i) {
        return _react["default"].createElement("rect", {
          key: "".concat(value),
          x: 0,
          y: valueScale(value) + 2.5,
          width: freqScale(observationCounts[value] / observations.length),
          height: binHeight,
          fill: colors[i]
        });
      }));
    }
  }]);

  return NominalTraceGroup;
}(_react["default"].Component);

var _default = NominalTraceGroup;
exports["default"] = _default;
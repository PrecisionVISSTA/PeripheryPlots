"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Shape = require("d3-shape");

var _d3Scale = require("d3-scale");

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

var LineGroup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LineGroup, _React$Component);

  function LineGroup() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, LineGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(LineGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      line: (0, _d3Shape.line)().curve(_d3Shape.curveMonotoneX),
      timeScale: (0, _d3Scale.scaleTime)(),
      valueScale: (0, _d3Scale.scaleLinear)()
    });

    return _this;
  }

  _createClass(LineGroup, [{
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
          line = _this$state.line,
          timeScale = _this$state.timeScale,
          valueScale = _this$state.valueScale;
      var scales = scaleRangeToBox(timeScale, valueScale);
      timeScale = scales.xScale;
      valueScale = scales.yScale;
      timeScale.domain(timeDomain);
      valueScale.domain(valueDomain);
      line.x(function (d) {
        return timeScale(d[timeKey]);
      }).y(function (d) {
        return valueScale(d[valueKey]);
      });
      return _react["default"].createElement("g", null, _react["default"].createElement("path", {
        d: line(observations),
        fill: "none",
        stroke: "steelblue"
      }));
    }
  }]);

  return LineGroup;
}(_react["default"].Component);

var _default = LineGroup;
exports["default"] = _default;
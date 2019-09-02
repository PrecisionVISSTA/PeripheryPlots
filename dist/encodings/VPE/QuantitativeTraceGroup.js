"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Scale = require("d3-scale");

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

var NUM_BINS = 8;

var QuantitativeTraceGroup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QuantitativeTraceGroup, _React$Component);

  function QuantitativeTraceGroup() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, QuantitativeTraceGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(QuantitativeTraceGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      valueScale: (0, _d3Scale.scaleLinear)(),
      freqScale: (0, _d3Scale.scaleLinear)()
    });

    return _this;
  }

  _createClass(QuantitativeTraceGroup, [{
    key: "render",
    value: function render() {
      var pplot = this.props.pplot;
      var valueKey = pplot.valueKey,
          valueDomain = pplot.valueDomain,
          yRange = pplot.yRange,
          xRange = pplot.xRange,
          observations = pplot.observations,
          scaleRangeToBox = pplot.scaleRangeToBox,
          isLeft = pplot.isLeft;
      var _this$state = this.state,
          freqScale = _this$state.freqScale,
          valueScale = _this$state.valueScale;
      var scales = scaleRangeToBox(freqScale, valueScale);
      freqScale = scales.xScale;
      valueScale = scales.yScale;
      freqScale.domain([0, 1.0]);
      valueScale.domain(valueDomain);

      var _yRange = _slicedToArray(yRange, 2),
          ymax = _yRange[0],
          ymin = _yRange[1];

      var binHeight = (ymax - ymin) / NUM_BINS;
      var values = observations.map(function (o) {
        return o[valueKey];
      });
      var numValues = values.length;
      var bins = [];

      for (var i = 0; i < NUM_BINS; i++) {
        // Bin ranges vertically from y0 to y1
        var y0 = binHeight * i + ymin;
        var y1 = y0 + binHeight; // Figure out which values are in this bin 

        var _map = [y0, y1].map(valueScale.invert),
            _map2 = _slicedToArray(_map, 2),
            v1 = _map2[0],
            v0 = _map2[1];

        var inds = Object.keys(values);
        var count = 0;

        for (var _i2 = 0, _inds = inds; _i2 < _inds.length; _i2++) {
          var key = _inds[_i2];

          if (values[key] >= v0 && values[key] <= v1) {
            count += 1;
            delete values[key];
          }
        }

        var p = count / numValues;
        bins.push({
          p: p,
          y0: y0
        });
      }

      var xWidth = xRange[1] - xRange[0];
      var tx = xRange[0];
      var ty = yRange[1];
      return _react["default"].createElement("g", {
        transform: isLeft ? "translate(".concat(xWidth + tx, ",").concat(ty, ") scale(-1,1) translate(").concat(-tx, ",").concat(-ty, ")") : ''
      }, bins.map(function (_ref, i) {
        var p = _ref.p,
            y0 = _ref.y0,
            y1 = _ref.y1;
        return _react["default"].createElement("rect", {
          key: "".concat(i),
          x: 0,
          y: y0,
          width: freqScale(p),
          height: binHeight,
          fill: 'steelblue'
        });
      }));
    }
  }]);

  return QuantitativeTraceGroup;
}(_react["default"].Component);

var _default = QuantitativeTraceGroup;
exports["default"] = _default;
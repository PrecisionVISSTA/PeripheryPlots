"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _d3Scale = require("d3-scale");

var _reactRedux = require("react-redux");

var _peripheryPlotContext = _interopRequireDefault(require("../../context/periphery-plot-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var lineStyle = {
  stroke: "rgb(0, 150, 136)",
  strokeDasharray: "1 1"
};
var hPadding = 3;

var ControlToTrackAligner =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ControlToTrackAligner, _React$Component);

  function ControlToTrackAligner() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ControlToTrackAligner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ControlToTrackAligner)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      alignerScale: (0, _d3Scale.scaleLinear)()
    });

    return _this;
  }

  _createClass(ControlToTrackAligner, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height,
          controlScale = _this$props.controlScale,
          timeDomains = _this$props.timeDomains,
          numContextsPerSide = _this$props.numContextsPerSide,
          containerPadding = _this$props.containerPadding,
          focusWidth = _this$props.focusWidth,
          contextWidth = _this$props.contextWidth,
          axesWidth = _this$props.axesWidth;
      var alignerScale = this.state.alignerScale;

      var _controlScale$range = controlScale.range(),
          _controlScale$range2 = _slicedToArray(_controlScale$range, 2),
          cr0 = _controlScale$range2[0],
          cr1 = _controlScale$range2[1];

      alignerScale.domain(controlScale.domain());
      alignerScale.range([cr0 + containerPadding, cr1 - containerPadding]);

      var topX = _.union(timeDomains.map(function (d) {
        return d[0];
      }), [timeDomains[timeDomains.length - 1][1]]).map(controlScale);

      var botX = _.range(0, numContextsPerSide).map(function (i) {
        return axesWidth + i * contextWidth;
      }); // Simple algorithm for determining y coordinates 


      var yMin = hPadding;
      var yMax = height - hPadding;
      var dy = yMax - yMin;
      var nYSteps = numContextsPerSide + 1;
      var yStep = dy / nYSteps;

      var yleft = _.range(0, numContextsPerSide + 1).map(function (i) {
        return hPadding + i * yStep;
      });

      var yright = _.reverse(yleft.slice());

      var ys = _.concat(yleft, yright);

      botX.push(axesWidth + numContextsPerSide * contextWidth);
      botX.push(axesWidth + numContextsPerSide * contextWidth + focusWidth);

      for (var i = 0; i < numContextsPerSide; i++) {
        botX.push(axesWidth + numContextsPerSide * contextWidth + focusWidth + (i + 1) * contextWidth);
      }

      return _react["default"].createElement("div", {
        style: {
          height: height
        }
      }, _react["default"].createElement("svg", {
        style: {
          width: width,
          height: height,
          paddingLeft: containerPadding,
          paddingRight: containerPadding,
          boxSizing: 'content-box'
        }
      }, topX.map(function (x, i) {
        return _react["default"].createElement("line", _extends({
          x1: x,
          x2: x,
          y1: 0,
          y2: ys[i]
        }, lineStyle));
      }), botX.map(function (x, i) {
        return _react["default"].createElement("line", _extends({
          x1: x,
          x2: x,
          y1: ys[i],
          y2: height
        }, lineStyle));
      }), _.range(0, topX.length).map(function (i) {
        var top = topX[i];
        var bot = botX[i];
        return _react["default"].createElement("line", _extends({
          x1: top,
          x2: bot,
          y1: ys[i],
          y2: ys[i]
        }, lineStyle));
      }), botX.map(function (x, i) {
        var dl = 6; // the length of the line 

        var dv = dl / Math.sqrt(2);
        return _react["default"].createElement("g", null, _react["default"].createElement("line", _extends({
          x1: x - dv,
          x2: x,
          y1: height - 1 - dv,
          y2: height
        }, lineStyle)), _react["default"].createElement("line", _extends({
          x1: x + dv,
          x2: x,
          y1: height - 1 - dv,
          y2: height
        }, lineStyle)));
      })));
    }
  }]);

  return ControlToTrackAligner;
}(_react["default"].Component);

var mapStateToProps = function mapStateToProps(_ref) {
  var timeDomains = _ref.timeDomains,
      numContextsPerSide = _ref.numContextsPerSide,
      timeExtentDomain = _ref.timeExtentDomain,
      containerPadding = _ref.containerPadding,
      axesWidth = _ref.axesWidth,
      focusWidth = _ref.focusWidth,
      contextWidth = _ref.contextWidth,
      contextWidthRatio = _ref.contextWidthRatio;
  return {
    timeDomains: timeDomains,
    numContextsPerSide: numContextsPerSide,
    timeExtentDomain: timeExtentDomain,
    containerPadding: containerPadding,
    axesWidth: axesWidth,
    focusWidth: focusWidth,
    contextWidth: contextWidth,
    contextWidthRatio: contextWidthRatio
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, null, null, {
  context: _peripheryPlotContext["default"]
})(ControlToTrackAligner);

exports["default"] = _default;
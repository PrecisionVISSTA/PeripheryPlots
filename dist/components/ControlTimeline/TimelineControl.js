"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _d3Selection = require("d3-selection");

var _d3Scale = require("d3-scale");

var _d3Axis = require("d3-axis");

var _d3Zoom = require("d3-zoom");

var _d3Brush = require("d3-brush");

var _d3Transition = require("d3-transition");

var _d3Ease = require("d3-ease");

var _lodash = _interopRequireDefault(require("lodash"));

var _peripheryPlotContext = _interopRequireDefault(require("../../context/periphery-plot-context"));

var _TimelineControlUtility = require("./TimelineControlUtility");

var _TimelineControlConfiguration = require("./TimelineControlConfiguration");

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

var MARGIN = _TimelineControlConfiguration.CONTROL_CONFIGURATION.MARGIN,
    LOCK_WIDTH = _TimelineControlConfiguration.CONTROL_CONFIGURATION.LOCK_WIDTH,
    LOCK_HEIGHT = _TimelineControlConfiguration.CONTROL_CONFIGURATION.LOCK_HEIGHT,
    HANDLE_WIDTH = _TimelineControlConfiguration.CONTROL_CONFIGURATION.HANDLE_WIDTH,
    HANDLE_HEIGHT = _TimelineControlConfiguration.CONTROL_CONFIGURATION.HANDLE_HEIGHT,
    MIN_CONTEXT_WIDTH = _TimelineControlConfiguration.CONTROL_CONFIGURATION.MIN_CONTEXT_WIDTH,
    MIN_FOCUS_WIDTH = _TimelineControlConfiguration.CONTROL_CONFIGURATION.MIN_FOCUS_WIDTH;

var tupdif = function tupdif(tup) {
  return tup[1] - tup[0];
};

function assert(condition, errMsg) {
  if (!condition) {
    throw new Error(errMsg);
  }
}

var TimelineControl =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TimelineControl, _React$Component);

  function TimelineControl(props) {
    var _this;

    _classCallCheck(this, TimelineControl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TimelineControl).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "state", {
      zoom: (0, _d3Zoom.zoom)(),
      // a zoom object
      brushes: [],
      //collection of d3 brush objects 
      brushIds: [],
      // Collection of brush ids for selection 
      brushLocks: [],
      // Collection of booleans to indicate whether or not a brush is locked 
      brushLockIds: [],
      // Collection of ids to reference brush lock ids 
      numBrushes: 0,
      // The total number of brushes 
      brushHeight: 0,
      // The vertical height of the brush 
      brushRanges: [],
      // The current selected regions for all brushes in pixel space 
      timelineScale: (0, _d3Scale.scaleTime)(),
      timelineAxis: (0, _d3Axis.axisBottom)()
    });

    _defineProperty(_assertThisInitialized(_this), "shiftBrushRange", function (msecsDuration) {
      /*
      Shift all unlocked brushes in a particular direction 
      */
      var d0 = _this.props.timeDomains[0][0]; // date pre-shift

      var d1 = new Date(d0.valueOf() + msecsDuration); // date post-shift

      var _map = [d0, d1].map(_this.props.controlScale),
          _map2 = _slicedToArray(_map, 2),
          p0 = _map2[0],
          p1 = _map2[1]; // pixel locations of pre and post shift dates 


      var shift = p0 - p1;

      var currentSelections = _this.getBrushRanges();

      var previousSelections = currentSelections.slice();
      var newSelections = currentSelections.slice();
      var targetBrushIndex = 1;
      newSelections[targetBrushIndex] = previousSelections[targetBrushIndex].map(function (v) {
        return v + shift;
      });
      newSelections = _this.computeAction(targetBrushIndex, newSelections, previousSelections);

      _this.updateAll(newSelections);
    });

    _defineProperty(_assertThisInitialized(_this), "lockBounds", function () {
      var leftLockId = _this.state.brushLockIds[0];
      var rightLockId = _this.state.brushLockIds[_this.state.brushLockIds.length - 1];

      _this.lockClick(leftLockId);

      _this.lockClick(rightLockId);
    });

    _defineProperty(_assertThisInitialized(_this), "setFocusBrushRange", function (msecsDuration) {
      /*
      Unlock boundaries and set focus width to some specified duration 
      */
      var isLocked = _this.state.brushLocks[0];

      if (isLocked) {
        _this.lockBounds();
      }

      var currentSelections = _this.getBrushRanges();

      var focusR = currentSelections[1];

      var _focusR = _slicedToArray(focusR, 2),
          focusS = _focusR[0],
          focusE = _focusR[1];

      var focusMiddle = (focusE + focusS) / 2;
      var sDate = _this.props.timeDomains[0][0];
      var eDate = new Date(sDate.valueOf() + msecsDuration);

      var _map3 = [sDate, eDate].map(_this.props.controlScale),
          _map4 = _slicedToArray(_map3, 2),
          s = _map4[0],
          e = _map4[1];

      var newWidth = e - s;
      var newS = focusMiddle - newWidth / 2;
      var newE = focusMiddle + newWidth / 2;
      var lShift = newS - focusS;
      var rShift = newE - focusE;
      var lR = currentSelections[0].map(function (v) {
        return v + lShift;
      });
      var cR = [newS, newE];
      var rR = currentSelections[2].map(function (v) {
        return v + rShift;
      });

      _this.updateAll([lR, cR, rR]);
    });

    _defineProperty(_assertThisInitialized(_this), "ingestProposal", function (proposal) {
      var shift = proposal.shift,
          dl = proposal.dl,
          dr = proposal.dr,
          index = proposal.index,
          id = proposal.id;

      var currentSelections = _this.getBrushRanges();

      var previousSelections1, previousSelections2, newSelections1, newSelections2, newSelections;

      switch (proposal.type) {
        case 'pan':
          // translate 
          previousSelections1 = currentSelections.slice();
          newSelections1 = previousSelections1.slice();
          newSelections1[index] = previousSelections1[index].map(function (v) {
            return v + shift;
          });
          newSelections = _this.computeAction(index, newSelections1, previousSelections1);
          break;

        case 'zoom':
          // grow/shrink left 
          previousSelections1 = currentSelections.slice();
          newSelections1 = currentSelections.slice();
          newSelections1[index] = [previousSelections1[index][0] + dl, previousSelections1[index][1]]; // grow/shrink right 

          previousSelections2 = _this.computeAction(index, newSelections1, previousSelections1);
          newSelections2 = previousSelections2.slice();
          newSelections2[index] = [previousSelections2[index][0], previousSelections2[index][1] + dr];
          newSelections = _this.computeAction(index, newSelections2, previousSelections2);
          break;
      }

      _this.updateAll(newSelections);
    });

    _defineProperty(_assertThisInitialized(_this), "createZoomCallback", function () {
      var lastX = null;
      var lastK = null;

      var zoomed = function zoomed() {
        // ignore zoom-by-brush
        if (_d3Selection.event.sourceEvent && _d3Selection.event.sourceEvent.type === "brush") {
          return;
        }

        var _zoomTransform = (0, _d3Zoom.zoomTransform)(_this.getZoomSelection().node()),
            k = _zoomTransform.k,
            x = _zoomTransform.x; // only process zooms 


        if (lastK && lastK === k) {
          return;
        }

        if (lastX === null || lastK === null) {
          lastK = k;
          lastX = x;
        } else {
          var newProposalId = Math.random();
          var zf = k / lastK;
          var index = Math.floor(_this.state.brushIds.length / 2);
          var bid = _this.state.brushIds[index];

          var _brushSelection = (0, _d3Brush.brushSelection)((0, _d3Selection.select)("#".concat(bid)).node()),
              _brushSelection2 = _slicedToArray(_brushSelection, 2),
              s0 = _brushSelection2[0],
              s1 = _brushSelection2[1];

          var width = s1 - s0;
          var newWidth = width * zf;
          var dWidth = Math.abs(newWidth - width);
          var dWidth2 = dWidth / 2;
          var dl = undefined;
          var dr = undefined;

          if (newWidth > width) {
            // grow to left and right
            dl = -dWidth2;
            dr = dWidth2;
          } else {
            dl = dWidth2;
            dr = -dWidth2;
          }

          var proposal = {
            id: newProposalId,
            index: index,
            type: 'zoom',
            shift: undefined,
            dl: dl,
            dr: dr
          };

          if (lastK !== k) {
            _this.ingestProposal(proposal);
          }

          lastX = x;
          lastK = k;
        }
      };

      return zoomed;
    });

    _defineProperty(_assertThisInitialized(_this), "appendTimeline", function () {
      var root = (0, _d3Selection.select)(_this.ROOT);
      var _this$props = _this.props,
          controlScale = _this$props.controlScale,
          containerPadding = _this$props.containerPadding,
          height = _this$props.height,
          width = _this$props.width,
          tickInterval = _this$props.tickInterval;
      var _this$state = _this.state,
          timelineScale = _this$state.timelineScale,
          timelineAxis = _this$state.timelineAxis;

      var _controlScale$range = controlScale.range(),
          _controlScale$range2 = _slicedToArray(_controlScale$range, 2),
          cr0 = _controlScale$range2[0],
          cr1 = _controlScale$range2[1];

      timelineScale.domain(controlScale.domain()).range([cr0 + containerPadding, cr1 - containerPadding]);
      var axisSvg = root.append('svg').attr('id', 'axis-svg').attr('height', height).attr('width', width).attr('pointer-events', 'none').style('position', 'absolute').style('top', containerPadding).style('left', 0).style('backgroundColor', 'rgba(0,0,0,0)'); // Create a timeline 

      var axisGenerator = timelineAxis.scale(timelineScale).ticks(tickInterval);
      axisSvg.append("g").attr('class', 'control-axis').call(axisGenerator).selectAll('text').classed('pplot-control-timeline-text', true);
    });

    _defineProperty(_assertThisInitialized(_this), "_updateBrushSelections", function (newSelections) {
      for (var i = 0; i < _this.state.numBrushes; i++) {
        (0, _d3Selection.select)("#".concat(_this.state.brushIds[i])).call(_this.state.brushes[i].move, newSelections[i]);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "computeActionProperties", function (index) {
      var currentSelections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var previousSelections = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      // Compute a set of properties related to the current action 
      var round2 = function round2(num) {
        return Number(num.toFixed(2));
      }; // round to 2 decimal places 


      var round1 = function round1(num) {
        return Number(num.toFixed(1));
      };

      var round = function round(num) {
        return Number(num.toFixed(0));
      };

      currentSelections = currentSelections === null ? _this.getBrushRanges() : currentSelections.slice();
      previousSelections = previousSelections === null ? _this.state.brushRanges.slice() : previousSelections.slice();
      var isFocus = index === _this.state.focusIndex;
      var preS = previousSelections[index].map(round2);
      var preW = tupdif(preS);
      var curS = currentSelections[index].map(round2);

      if (preS[0] === curS[0] && preS[1] === curS[1]) {
        // edge case where no movement occurred 
        return {
          'noChange': true,
          previousSelections: previousSelections
        };
      }

      var _this$isBrushLocked = _this.isBrushLocked(index),
          _this$isBrushLocked2 = _slicedToArray(_this$isBrushLocked, 2),
          leftHandleLocked = _this$isBrushLocked2[0],
          rightHandleLocked = _this$isBrushLocked2[1];

      var isLocked = leftHandleLocked || rightHandleLocked;
      var leftIndexRange = [0, index];
      var rightIndexRange = [Math.min(_this.state.numBrushes, index + 1), _this.state.numBrushes];
      var minWidth = _this.state.focusIndex === index ? MIN_FOCUS_WIDTH : MIN_CONTEXT_WIDTH;
      var curWidth = curS[1] - curS[0];
      var tooSmall = curWidth < minWidth;

      var brushLockBounds = _this.getLockBounds(index);

      var _brushLockBounds = _slicedToArray(brushLockBounds, 2),
          leftLockIndex = _brushLockBounds[0],
          rightLockIndex = _brushLockBounds[1];

      var lockedToLeft = brushLockBounds[0] !== -1;
      var lockedToRight = brushLockBounds[1] !== -1;
      var leftLockBoundS = lockedToLeft ? currentSelections[leftLockIndex] : null;
      var rightLockBoundS = lockedToRight ? currentSelections[rightLockIndex] : null;
      var action = (0, _TimelineControlUtility.computeActionFromSelectionTransition)(preS, curS);
      var leftOverlappedRight = preS[1] === curS[0];
      var rightOverlappedLeft = preS[0] === curS[1];
      var overlapped = leftOverlappedRight || rightOverlappedLeft;
      var isFirst = index === 0;
      var isLast = index === numBrushes - 1;
      var shiftSet = [];
      var numBrushes = _this.state.numBrushes;

      if (action === null) {
        debugger;
      }

      assert(action !== null, 'invalid brush action');
      var properties = {
        isFocus: isFocus,
        action: action,
        currentSelections: currentSelections,
        previousSelections: previousSelections,
        preS: preS,
        preW: preW,
        curS: curS,
        numBrushes: numBrushes,
        overlapped: overlapped,
        leftHandleLocked: leftHandleLocked,
        rightHandleLocked: rightHandleLocked,
        isLocked: isLocked,
        leftIndexRange: leftIndexRange,
        rightIndexRange: rightIndexRange,
        minWidth: minWidth,
        curWidth: curWidth,
        tooSmall: tooSmall,
        brushLockBounds: brushLockBounds,
        lockedToLeft: lockedToLeft,
        lockedToRight: lockedToRight,
        leftLockIndex: leftLockIndex,
        rightLockIndex: rightLockIndex,
        leftLockBoundS: leftLockBoundS,
        rightLockBoundS: rightLockBoundS,
        leftOverlappedRight: leftOverlappedRight,
        rightOverlappedLeft: rightOverlappedLeft,
        shiftSet: shiftSet,
        isFirst: isFirst,
        isLast: isLast
      };
      return properties;
    });

    _defineProperty(_assertThisInitialized(_this), "isBrushLeftLocked", function (brushIndex) {
      return _this.state.brushLocks[brushIndex];
    });

    _defineProperty(_assertThisInitialized(_this), "isBrushRightLocked", function (brushIndex) {
      return _this.state.brushLocks[brushIndex + 1];
    });

    _defineProperty(_assertThisInitialized(_this), "isBrushLocked", function (brushIndex) {
      return [_this.isBrushLeftLocked(brushIndex), _this.isBrushRightLocked(brushIndex)];
    });

    _defineProperty(_assertThisInitialized(_this), "getBrushRanges", function () {
      return (// Returns an array of two element lists, each representing the current selected pixel 
        // region of all of the brushes 
        _this.state.brushIds.map(function (id) {
          return (0, _d3Selection.select)("#".concat(id)).node();
        }).map(_d3Brush.brushSelection)
      );
    });

    _defineProperty(_assertThisInitialized(_this), "computeAndPerformAction", function (index, currentSelections) {
      return _this.updateAll(_this.computeAction(index, currentSelections));
    });

    _defineProperty(_assertThisInitialized(_this), "userBrushed", function (index) {
      return _this.isUserGeneratedBrushEvent(index) && _this.computeAndPerformAction(index);
    });

    _defineProperty(_assertThisInitialized(_this), "isUserGeneratedBrushEvent", function (index) {
      return !( // Ensure the current event was a user brush interaction 
      // We do not perform updates on zooms of via calls to brush.move 
      !(0, _d3Selection.select)("#".concat(_this.state.brushIds[index])).node() || !_d3Selection.event.sourceEvent || _d3Selection.event.sourceEvent && _d3Selection.event.sourceEvent.type === 'brush' || _d3Selection.event.sourceEvent && _d3Selection.event.sourceEvent.type === 'zoom');
    });

    _defineProperty(_assertThisInitialized(_this), "updateAll", function (newSelections) {
      var updateTimeDomains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _this._updateBrushSelections(newSelections);

      _this._updateBrushExtras(newSelections);

      _this.setState({
        brushRanges: newSelections
      });

      if (updateTimeDomains) {
        var newTimeDomains = newSelections.map(function (s) {
          return s.map(_this.props.controlScale.invert).map(function (t) {
            return new Date(t);
          });
        });

        _this.props.ACTION_CHANGE_timeDomains(newTimeDomains);
      }
    });

    var _this$props2 = _this.props,
        _height = _this$props2.height,
        timeDomains = _this$props2.timeDomains; // Infer the number of brushes 

    _this.state.numBrushes = timeDomains.length; // Infer focus index

    _this.state.focusIndex = parseInt(_this.state.numBrushes / 2);

    var brushIndexList = _lodash["default"].range(0, _this.state.numBrushes); // The currently selected brush areas (pixels)


    _this.state.brushRanges = _this.props.timeDomains.map(function (domain) {
      return domain.map(_this.props.controlScale);
    }); // Initialize the brushes 

    _this.state.brushes = brushIndexList.map(function (i) {
      return (0, _d3Brush.brushX)();
    }); // Initialize a collection of ids for the brushes 

    _this.state.brushIds = brushIndexList.map(function (i) {
      return "brush-".concat(i);
    }); // Initialize a collection of ids for the brush clips 

    _this.state.clipIds = _this.state.brushIds.map(function (id) {
      return "".concat(id, "-clip");
    }); // Create numBrushes + 1 lock ids 

    _this.state.brushLockIds = _lodash["default"].range(0, _this.state.numBrushes + 1).map(function (i) {
      return "lock-".concat(i);
    }); // Set the initial locked state for all locks to false 

    _this.state.brushLocks = _this.state.brushLockIds.map(function (i) {
      return false;
    }); // Brush height - takes up 75% of vertical space in the container (not including MARGIN)

    _this.state.brushHeight = _height - 2 - LOCK_HEIGHT;
    return _this;
  }
  /*
  externally: 
    * user can set width of focus region 
    * user can shift all brushes some duration to the left or right 
  */


  _createClass(TimelineControl, [{
    key: "initZoom",
    value: function initZoom() {
      // attach zoom panel to focus zone 
      var zoom = this.state.zoom;
      var s = this.getZoomSelection();
      var zoomCallback = this.createZoomCallback();
      s.call(zoom.on('zoom', zoomCallback));
    }
  }, {
    key: "getZoomSelection",
    value: function getZoomSelection() {
      return (0, _d3Selection.select)("#".concat(this.state.brushIds[Math.floor(this.state.brushIds.length / 2)]));
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      // If container was resized, we need to resize the control axis and brushes 
      var resized = nextProps.width !== this.props.width && nextProps.width > 0;
      var timeDomainsChanged = !_lodash["default"].isEqual(this.props.timeDomains, nextProps.timeDomains);

      if (resized || timeDomainsChanged) {
        var containerPadding = nextProps.containerPadding,
            width = nextProps.width;
        var timelineScale = nextState.timelineScale,
            timelineAxis = nextState.timelineAxis; // Update the control axis 

        (0, _d3Selection.select)('#axis-svg').attr('width', width);
        timelineScale.range([containerPadding, width - containerPadding]);
        (0, _d3Selection.selectAll)('.control-axis').call(timelineAxis); // Update width of brush contianer 

        (0, _d3Selection.select)('#brush-svg').attr('width', width - containerPadding * 2); // Pixel ranges for each brush 

        var updateTimeDomains = !timeDomainsChanged;
        this.updateAll(nextProps.timeDomains.map(function (domain) {
          return domain.map(nextProps.controlScale);
        }), updateTimeDomains);
      } // D3 performs all other updates 


      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Code to create the d3 element, using the root container 
      var _this$props3 = this.props,
          width = _this$props3.width,
          height = _this$props3.height,
          focusColor = _this$props3.focusColor,
          contextColor = _this$props3.contextColor,
          containerPadding = _this$props3.containerPadding,
          lockActiveColor = _this$props3.lockActiveColor,
          lockInactiveColor = _this$props3.lockInactiveColor,
          lockOutlineColor = _this$props3.lockOutlineColor,
          handleOutlineColor = _this$props3.handleOutlineColor,
          brushOutlineColor = _this$props3.brushOutlineColor,
          lockBounds = _this$props3.lockBounds;
      var root = (0, _d3Selection.select)(this.ROOT); // Create the svg container for the brushes

      var svg = root.append('svg').attr('id', 'brush-svg').attr('width', width - containerPadding * 2).attr('height', height); // append dom node for capturing external proposals for shifts 

      var n = root.append("div").attr("id", 'external-proposal');
      n.on('click.setFocusBrushRange', this.setFocusBrushRange);
      n.on('click.lockBounds', this.lockBounds);
      n.on('click.shiftBrushRange', this.shiftBrushRange);
      n.on('zoom.trackZoom', this.ingestProposal); // Pixel ranges for each brush 

      var brushRanges = this.props.timeDomains.map(function (domain) {
        return domain.map(_this2.props.controlScale);
      }); // Create a clipping path for each brush  

      for (var i = 0; i < this.state.numBrushes; i++) {
        var clipId = this.state.clipIds[i];
        var _brushSelection3 = brushRanges[i];
        svg.append('clipPath').attr('id', clipId).append('rect').attr('x', 0).attr('y', 0).attr('width', tupdif(_brushSelection3)).attr('height', this.state.brushHeight).attr('transform', "translate(".concat(_brushSelection3[0], ", 0)"));
      }

      this.lockClick = function (lockId) {
        // Determine the lock index of the clicked lock 
        var lockIndex = _this2.state.brushLockIds.indexOf(lockId);

        assert(lockIndex >= 0, 'lock doesnt exist'); // Toggle the lock state

        var brushLocks = _this2.state.brushLocks;
        brushLocks[lockIndex] = !brushLocks[lockIndex];

        _this2.setState({
          brushLocks: brushLocks
        }); // Apply an animation to the lock to indicate the change 


        (0, _d3Selection.select)("#".concat(lockId)).transition((0, _d3Transition.transition)().duration(300).ease(_d3Ease.easeLinear)).attr('fill', brushLocks[lockIndex] ? lockActiveColor : lockInactiveColor);
      };

      var addLock = function addLock(x, y, lockId) {
        // Add a lock object at the given x,y position extending downwards
        svg.append('g').append('rect').attr('id', lockId).attr('x', 0).attr('y', y).attr('stroke', lockOutlineColor).attr('width', LOCK_WIDTH).attr('height', LOCK_HEIGHT).attr('transform', "translate(".concat(x - LOCK_WIDTH / 2, ",0)")).attr('fill', lockInactiveColor).attr('rx', LOCK_HEIGHT / 4).style("cursor", "pointer").on('click', _lodash["default"].partial(_this2.lockClick, lockId));
      }; // Creating a locking mechanism for every bi-directional handle 


      var dy = 1;
      var lockTopY = this.state.brushHeight + dy; // locks are placed right below bottom of brush 

      for (var _i2 = 0, li = 0; _i2 < this.state.numBrushes; _i2++) {
        var _brushSelection4 = brushRanges[_i2];
        var isFirst = _i2 === 0;

        if (isFirst) {
          // Add a lock to the beginning and end of the current brush 
          addLock(_brushSelection4[0], lockTopY, this.state.brushLockIds[li++]);
          addLock(_brushSelection4[1], lockTopY, this.state.brushLockIds[li++]);
        } else {
          // Add a lock to the end of the current brush 
          addLock(_brushSelection4[1], lockTopY, this.state.brushLockIds[li++]);
        }
      } // check if outer bounds are initially locked 


      if (lockBounds) {
        var leftLockId = this.state.brushLockIds[0];
        var rightLockId = this.state.brushLockIds[this.state.brushLockIds.length - 1];
        this.lockClick(leftLockId);
        this.lockClick(rightLockId);
      } // Create brushes 


      var _loop = function _loop(_i3) {
        var brushFn = _this2.state.brushes[_i3];
        var brushId = _this2.state.brushIds[_i3];
        var clipId = _this2.state.clipIds[_i3];
        var brushSelection = brushRanges[_i3];

        var isFocus = _i3 === parseInt(_this2.state.numBrushes / 2); // Set the width ; height of the brush, height is retained when future transforms (resize / translate) are applied 


        brushFn.extent([[-10000, MARGIN.top], [10000, _this2.state.brushHeight]]); // Add a brush to the svg 

        var userBrushed = _lodash["default"].partial(_this2.userBrushed, _i3);

        var brushG = svg.append("g").attr("id", brushId).attr('class', 'brush').attr('clipPath', "url(#".concat(clipId, ")")).call(brushFn.on("brush", userBrushed)).call(brushFn.move, brushSelection); // Removes white stroke outline from brush. This looks bad if the user uses a custom style 
        // and the background color clashes with the white 

        brushG.selectAll('rect').attr('stroke', 'none'); // Removes pointer events on overlay which takes up 100% of space in svg container 
        // By doing this, we only capture mouse events that occur over the selection region 
        // of the brush 

        brushG.select("rect.overlay").style("pointer-events", "none"); // Styling the brush selection 

        brushG.select("rect.selection").attr('stroke', brushOutlineColor).style("fill", isFocus ? focusColor : contextColor); // Append custom handles to brush

        brushG.selectAll(".handle--custom").data([{
          type: "w"
        }, {
          type: "e"
        }]).enter().append("g").attr('clipPath', "url(#".concat(clipId, ")")).append("rect").attr('clipPath', "url(#".concat(clipId, ")")).attr('stroke', handleOutlineColor).attr('x', 0).attr('y', _this2.state.brushHeight / 2 - HANDLE_HEIGHT / 2).attr('width', HANDLE_WIDTH).attr('height', HANDLE_HEIGHT).attr('transform', function (d) {
          return d.type === 'w' ? "translate(".concat(brushSelection[0], ",0)") : "translate(".concat(brushSelection[1] - HANDLE_WIDTH, ",0)");
        }).attr('rx', 3).attr("class", function (d) {
          return "handle--custom ".concat(d.type === 'w' ? 'handle-left' : 'handle-right');
        }).attr("fill", "#009688").attr("fill-opacity", 0.8).style("cursor", "ew-resize"); // Disable existing brushes. Pointer events only active on custom brushes 

        brushG.select('.handle--e').style('pointer-events', 'none');
        brushG.select('.handle--w').style('pointer-events', 'none');
      };

      for (var _i3 = 0; _i3 < this.state.numBrushes; _i3++) {
        _loop(_i3);
      }

      this.appendTimeline();
      this.initZoom();
    }
  }, {
    key: "_updateBrushExtras",
    value: function _updateBrushExtras(newSelections) {
      var _this3 = this;

      // update left handles 
      var leftHandles = (0, _d3Selection.selectAll)(".handle-left");
      var leftNodes = leftHandles.nodes();

      _lodash["default"].sortBy(leftNodes.map(function (node) {
        return parseInt(node.attributes.nodeValue);
      }).map(function (pos, hi) {
        return {
          pos: pos,
          hi: hi
        };
      }), function (obj) {
        return obj.pos;
      }).map(function (_ref) {
        var hi = _ref.hi;
        return hi;
      }).map(function (hi, bi) {
        return (0, _d3Selection.select)(leftNodes[hi]).attr('transform', "translate(".concat(newSelections[bi][0], ",0)"));
      }); // update right handles 


      var rightHandles = (0, _d3Selection.selectAll)(".handle-right");
      var rightNodes = rightHandles.nodes();

      _lodash["default"].sortBy(rightNodes.map(function (node) {
        return parseInt(node.attributes.nodeValue);
      }).map(function (pos, hi) {
        return {
          pos: pos,
          hi: hi
        };
      }), function (obj) {
        return obj.pos;
      }).map(function (_ref2) {
        var hi = _ref2.hi;
        return hi;
      }).map(function (hi, bi) {
        return (0, _d3Selection.select)(rightNodes[hi]).attr('transform', "translate(".concat(newSelections[bi][1] - HANDLE_WIDTH, ", 0)"));
      }); // update clip positions 


      _lodash["default"].range(0, this.state.numBrushes).map(function (i) {
        return (0, _d3Selection.select)("#".concat(_this3.state.clipIds[i], " > rect")).attr('transform', "translate(".concat(parseInt(newSelections[i][0]), ", 0)")).attr('width', tupdif(newSelections[i]));
      }); // update lock positions


      for (var i = 0; i < this.state.numBrushes; i++) {
        if (i === 0) {
          (0, _d3Selection.select)("#".concat(this.state.brushLockIds[i])).attr('transform', "translate(".concat(newSelections[i][0] - LOCK_WIDTH / 2, ",0)"));
          (0, _d3Selection.select)("#".concat(this.state.brushLockIds[i + 1])).attr('transform', "translate(".concat(newSelections[i][1] - LOCK_WIDTH / 2, ",0)"));
        } else {
          (0, _d3Selection.select)("#".concat(this.state.brushLockIds[i + 1])).attr('transform', "translate(".concat(newSelections[i][1] - LOCK_WIDTH / 2, ",0)"));
        }
      }
    }
  }, {
    key: "getLockBounds",
    value: function getLockBounds(brushIndex) {
      // Determine the closest brush to the left of the current brush that is either left or right locked
      // this can possibly be the current brush 
      var leftLockedBrushIndex = -1;

      for (var i = brushIndex - 1; i >= 0; i--) {
        var _this$isBrushLocked3 = this.isBrushLocked(i),
            _this$isBrushLocked4 = _slicedToArray(_this$isBrushLocked3, 2),
            leftHandleLocked = _this$isBrushLocked4[0],
            rightHandleLocked = _this$isBrushLocked4[1];

        if (leftHandleLocked || rightHandleLocked) {
          leftLockedBrushIndex = i;
          break;
        }
      } // Determine the closest brush to the right of the current brush that is either left or right locked
      // this can possibly be the current brush 


      var rightLockedBrushIndex = -1;

      for (var _i4 = brushIndex + 1; _i4 < this.state.numBrushes; _i4++) {
        var _this$isBrushLocked5 = this.isBrushLocked(_i4),
            _this$isBrushLocked6 = _slicedToArray(_this$isBrushLocked5, 2),
            leftHandleLocked = _this$isBrushLocked6[0],
            rightHandleLocked = _this$isBrushLocked6[1];

        if (leftHandleLocked || rightHandleLocked) {
          rightLockedBrushIndex = _i4;
          break;
        }
      }

      return [leftLockedBrushIndex, rightLockedBrushIndex];
    }
  }, {
    key: "computeAction",
    value: function computeAction(index) {
      var currentSelections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var previousSelections = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var actionProperties = this.computeActionProperties(index, currentSelections, previousSelections);
      var noChange = actionProperties.noChange;

      if (noChange) {
        return actionProperties.previousSelections;
      }

      var newSelections;

      if (actionProperties.overlapped) {
        newSelections = actionProperties.previousSelections;
      } else {
        var actionExecutor = (0, _TimelineControlUtility.functionFromAction)(actionProperties.action);
        var res = actionExecutor(index, actionProperties);
        newSelections = res.currentSelections;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.shiftSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var shiftObj = _step.value;
            var shift = shiftObj.shift,
                shiftIndices = shiftObj.shiftIndices;
            newSelections = (0, _TimelineControlUtility.performShifts)(newSelections, shiftIndices, shift);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return newSelections;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props4 = this.props,
          height = _this$props4.height,
          containerPadding = _this$props4.containerPadding;
      var containerStyle = {
        display: 'block',
        position: 'relative',
        paddingLeft: containerPadding,
        paddingRight: containerPadding,
        paddingTop: containerPadding,
        boxSizing: 'content-box',
        height: height
      };
      return _react["default"].createElement("div", {
        style: containerStyle,
        ref: function ref(_ref3) {
          return _this4.ROOT = _ref3;
        }
      });
    }
  }]);

  return TimelineControl;
}(_react["default"].Component);

var mapStateToProps = function mapStateToProps(_ref4) {
  var timeDomains = _ref4.timeDomains,
      focusColor = _ref4.focusColor,
      contextColor = _ref4.contextColor,
      containerPadding = _ref4.containerPadding,
      proposal = _ref4.proposal,
      tickInterval = _ref4.tickInterval,
      lockActiveColor = _ref4.lockActiveColor,
      lockInactiveColor = _ref4.lockInactiveColor,
      lockOutlineColor = _ref4.lockOutlineColor,
      handleOutlineColor = _ref4.handleOutlineColor,
      brushOutlineColor = _ref4.brushOutlineColor,
      controlScale = _ref4.controlScale,
      baseWidth = _ref4.baseWidth,
      controlTimelineHeight = _ref4.controlTimelineHeight,
      lockBounds = _ref4.lockBounds;
  return {
    timeDomains: timeDomains,
    focusColor: focusColor,
    contextColor: contextColor,
    containerPadding: containerPadding,
    proposal: proposal,
    tickInterval: tickInterval,
    lockActiveColor: lockActiveColor,
    lockInactiveColor: lockInactiveColor,
    lockOutlineColor: lockOutlineColor,
    handleOutlineColor: handleOutlineColor,
    brushOutlineColor: brushOutlineColor,
    controlScale: controlScale,
    width: baseWidth,
    height: controlTimelineHeight,
    lockBounds: lockBounds
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    ACTION_CHANGE_timeDomains: function ACTION_CHANGE_timeDomains(timeDomains) {
      return dispatch((0, _actions.ACTION_CHANGE_timeDomains)(timeDomains));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, null, {
  context: _peripheryPlotContext["default"]
})(TimelineControl);

exports["default"] = _default;
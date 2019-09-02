"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validateConfiguration;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function assert(condition, errorMsg) {
  if (!condition) throw new Error(errorMsg);
}

function allArrayElemsEqual(arr) {
  return arr.every(function (v) {
    return v === arr[0];
  });
}

function validateConfiguration(config) {
  /*
  Checks a number of conditions related to the required specification of input parameters 
  */
  var trackwiseObservations = config.trackwiseObservations,
      trackwiseTimeKeys = config.trackwiseTimeKeys,
      trackwiseValueKeys = config.trackwiseValueKeys,
      trackwiseTypes = config.trackwiseTypes,
      trackwiseUnits = config.trackwiseUnits,
      trackwiseEncodings = config.trackwiseEncodings,
      applyContextEncodingsUniformly = config.applyContextEncodingsUniformly,
      numContextsPerSide = config.numContextsPerSide,
      timeExtentDomain = config.timeExtentDomain,
      timeDomains = config.timeDomains,
      contextWidthRatio = config.contextWidthRatio;

  var getConfigValueFromParameterName = function getConfigValueFromParameterName(pname) {
    return config[pname];
  };

  var trackParameterNames = ['trackwiseObservations', 'trackwiseTimeKeys', 'trackwiseValueKeys', 'trackwiseTypes', 'trackwiseUnits', 'trackwiseEncodings'];
  var controlParameterNames = ['timeExtentDomain', 'timeDomains']; // Order of parameters does matter for some tests 

  var allParameterNames = _lodash["default"].concat(trackParameterNames, controlParameterNames); // Ensure all track config parameters (which are provably arrays as per prior tests) have the same length


  var arrLens = trackParameterNames.map(getConfigValueFromParameterName).map(function (arr) {
    return arr.length;
  });
  assert(allArrayElemsEqual(arrLens), 'track config inputs are arrays but have different lengths');
  var len = trackwiseObservations.length; // Create a suite of test functions for each individual input 

  var testingFunctions = {
    TEST_trackwiseTimeKeys: function TEST_trackwiseTimeKeys() {
      // Ensure all timeKeys are a valid index into the corresponding data source 
      for (var i = 0; i < len; i++) {
        var data = trackwiseObservations[i];
        var timeKey = trackwiseTimeKeys[i];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var o = _step.value;
            assert(o[timeKey] instanceof Date, 'unable to index into data observation with time key');
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
    },
    TEST_trackwiseValueKeys: function TEST_trackwiseValueKeys() {
      // Ensure all valueKeys are a valid index into the corresponding data source 
      for (var i = 0; i < len; i++) {
        var data = trackwiseObservations[i];
        var valueKey = trackwiseValueKeys[i];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var o = _step2.value;
            assert(o[valueKey] !== undefined, 'unable to index into data observation with value key');
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    },
    TEST_trackwiseEncodings: function TEST_trackwiseEncodings() {
      // Ensure all encoding specs are of the same length 
      var arrLens = trackwiseEncodings.map(function (arr) {
        return arr.length;
      });
      assert(arrLens[0] > 0 && allArrayElemsEqual(arrLens), 'input encoding specs are of different lengths'); // Ensure that the correct number of encodings are specified for each track

      assert(arrLens[0] === applyContextEncodingsUniformly ? 3 : 2 * numContextsPerSide + 1);
    },
    TEST_timeDomains: function TEST_timeDomains() {
      // Ensure all timeDomains are of the expected form
      assert(timeDomains.length === numContextsPerSide * 2 + 1, 'incorrect number of timeDomains specified');
    } // Run through tests for individual parameters. If some unexpected error is encountered during one of the tests, 
    // we throw an error and include the test which included the source of this anomalous error. 

  };
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = allParameterNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var pname = _step3.value;

      try {
        // console.log('validating: ', pname);
        var fname = "TEST_".concat(pname);
        var func = testingFunctions[fname];
        if (func) func();
      } catch (err) {
        throw new Error("Error when validating configuration parameter: ".concat(pname, "\n\n").concat(err));
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}
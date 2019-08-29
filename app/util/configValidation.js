import _ from "lodash"; 

function assert(condition, errorMsg) {
    if (!condition) throw new Error(errorMsg); 
}

function allArrayElemsEqual(arr) {
    return arr.every(v => v === arr[0]); 
}

export default function validateConfiguration(config) {

    /*
    Checks a number of conditions related to the required specification of input parameters 
    */

    let { 
        // track configuration 
        trackwiseObservations,
        trackwiseTimeKeys, 
        trackwiseValueKeys, 
        trackwiseTypes, 
        trackwiseUnits, 
        trackwiseEncodings,
        applyContextEncodingsUniformly, 
        numContextsPerSide, 

        // control timeline configuration 
        timeExtentDomain, 
        timeDomains, 

        contextWidthRatio

    } = config; 

    let getConfigValueFromParameterName = pname => config[pname]; 

    let trackParameterNames = [
        'trackwiseObservations', 
        'trackwiseTimeKeys',
        'trackwiseValueKeys',
        'trackwiseTypes',
        'trackwiseUnits',
        'trackwiseEncodings'
    ]; 

    let controlParameterNames = [
        'timeExtentDomain', 
        'timeDomains'
    ]; 

    // Order of parameters does matter for some tests 
    let allParameterNames = _.concat(trackParameterNames, controlParameterNames); 

    // Ensure all track config parameters (which are provably arrays as per prior tests) have the same length
    let arrLens = trackParameterNames.map(getConfigValueFromParameterName).map(arr => arr.length); 
    assert(allArrayElemsEqual(arrLens), 'track config inputs are arrays but have different lengths'); 

    let len = trackwiseObservations.length; 

    // Create a suite of test functions for each individual input 
    let testingFunctions = {

        TEST_trackwiseTimeKeys: function() {

            // Ensure all timeKeys are a valid index into the corresponding data source 
            for (let i = 0; i < len; i++) {
                let data = trackwiseObservations[i]; 
                let timeKey = trackwiseTimeKeys[i]; 
                for (let o of data) { 
                    assert(o[timeKey] instanceof Date, 'unable to index into data observation with time key'); 
                }
            }
    
        },

        TEST_trackwiseValueKeys: function() {

            // Ensure all valueKeys are a valid index into the corresponding data source 
            for (let i = 0; i < len; i++) {
                let data = trackwiseObservations[i]; 
                let valueKey = trackwiseValueKeys[i]; 
                for (let o of data) {
                    assert(o[valueKey] !== undefined, 'unable to index into data observation with value key'); 
                }
            }
    
        }, 

        TEST_trackwiseEncodings: function() {

            // Ensure all encoding specs are of the same length 
            let arrLens = trackwiseEncodings.map(arr => arr.length); 
            assert(arrLens[0] > 0 && allArrayElemsEqual(arrLens), 'input encoding specs are of different lengths'); 

            // Ensure that the correct number of encodings are specified for each track
            assert(arrLens[0] === applyContextEncodingsUniformly ? 3 : 2 * numContextsPerSide + 1); 

        }, 

        TEST_timeDomains: function() {

            // Ensure all timeDomains are of the expected form
            assert(timeDomains.length === numContextsPerSide * 2 + 1, 'incorrect number of timeDomains specified');

        }

    }

    // Run through tests for individual parameters. If some unexpected error is encountered during one of the tests, 
    // we throw an error and include the test which included the source of this anomalous error. 
    for (let pname of allParameterNames) {
        try {
            // console.log('validating: ', pname);
            let fname = `TEST_${pname}`; 
            let func = testingFunctions[fname]; 
            if (func) func(); 
        } catch (err) {
            throw new Error(`Error when validating configuration parameter: ${pname}\n\n${err}`); 
        }
    }

}
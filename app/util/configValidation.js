import _ from "lodash"; 
import React from "react"; 

function assert(condition, errorMsg) {
    if (!condition) throw new Error(errorMsg); 
}

function isObjectAndNotNull(value) {
    return typeof value === 'object' && value !== null; 
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
        trackwiseObservations, //done
        trackwiseTimeKeys, 
        trackwiseValueKeys, 
        trackwiseTypes, 
        trackwiseUnits, 
        trackwiseEncodings,
        applyContextsUniformly, 
        numContextsPerSide, 

        // control timeline configuration 
        timeExtentDomain, 
        timeDomains

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

    // Ensure all input configuration parameters are arrays 
    for (let pname of allParameterNames) {
        assert(Array.isArray(config[pname]), `parameter: ${pname} is not of type Array`); 
    }

    // Ensure all track config parameters (which are provably arrays as per prior tests) have the same length
    let arrLens = trackParameterNames.map(getConfigValueFromParameterName).map(arr => arr.length); 
    assert(allArrayElemsEqual(arrLens), 'track config inputs are arrays but have different lengths'); 

    let len = trackwiseObservations.length; 

    // Ensure that applyContextsUniformly is a boolean 
    assert(typeof applyContextsUniformly === 'boolean', 'attribute "applyContextsUniformly" should be a boolean'); 

    // Ensure that numContextsPerSide is a number 
    assert(typeof numContextsPerSide === 'number', 'attribute "numContextsPerSide" should be an integer')

    // Create a suite of test functions for each individual input 
    let testingFunctions = {

        TEST_trackwiseObservations: function() {

            // Ensure all input data sources are arrays 
            for (let obs of trackwiseObservations) {
                assert(Array.isArray(obs), 'an input data source is not of type Array');
            }
    
            // For each input data source, ensure each individual element of the data array is an object 
            for (let obs of trackwiseObservations) {
                for (let o of obs) {
                    assert(isObjectAndNotNull(o), 'a value in an input data source was not of type Object'); 
                }
            }
    
        }, 

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

        TEST_trackwiseTypes: function() {
            
            // Ensure all track types are either 'continuous' or 'discrete' 
            let validTypes = ['continuous', 'discrete']; 
            for (let t of trackwiseTypes) {
                assert(validTypes.includes(t), 'invalid track type specified. must be "continuous" or "discrete"'); 
            }
        }, 

        TEST_trackwiseUnits: function() {

            // Ensure each unit is either a string or null (representing no units)
            for (let u of trackwiseUnits) {
                assert(u === null || typeof u === 'string', 'invalid track unit specified'); 
            }

        }, 

        TEST_trackwiseEncodings: function() {

            // Ensure all input encoding specifications are arrays 
            let areArrays = trackwiseEncodings.map(encoding => Array.isArray(encoding)); 
            assert(areArrays.length > 0 && areArrays[0] === true && allArrayElemsEqual(areArrays), 'an input encoding specification is not of type Array'); 

            // Ensure all encoding specs are of the same length 
            let arrLens = trackwiseEncodings.map(arr => arr.length); 
            assert(arrLens[0] > 0 && allArrayElemsEqual(arrLens), 'input encoding specs are of different lengths'); 

            // Validate individual elements of each encoding spec 
            for (let encodingSpec of trackwiseEncodings) {
                for (let encodingSpecElem of encodingSpec) {
                    if (Array.isArray(encodingSpecElem)) {
                        assert(encodingSpecElem.length > 0, 'encodings specified as array but array was empty');
                    }
                }
            }

            // Ensure that the correct number of encodings are specified for each track
            assert(arrLens[0] === applyContextsUniformly ? 3 : 2 * numContextsPerSide + 1); 

        }, 

        TEST_timeExtentDomain: function() {

            // Ensure timeExtentDomain is a temporal range 
            assert(timeExtentDomain.length === 2 && 
                   timeExtentDomain[0] instanceof Date && 
                   timeExtentDomain[1] instanceof Date, 
                   'timeExtentDomain specified incorrectly'); 
        
        },

        TEST_timeDomains: function() {

            // Ensure all timeDomains are of the expected form
            assert(timeDomains.length === numContextsPerSide * 2 + 1, 'incorrect number of timeDomains specified');
            for (let d of timeDomains) {
                assert(d[0] instanceof Date && d[1] instanceof Date, 'a domain in timeDomains was not specified correctly');  
            } 

        }

    }

    // Run through tests for individual parameters. If some unexpected error is encountered during one of the tests, 
    // we throw an error and include the test which included the source of this anomalous error. 
    for (let pname of allParameterNames) {
        try {
            // console.log('validating: ', pname); 
            testingFunctions[`TEST_${pname}`](); 
        } catch (err) {
            throw new Error(`Error when validating configuration parameter: ${pname}\n\n${err}`); 
        }
    }

}
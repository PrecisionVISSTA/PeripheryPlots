import React from "react"; 
import * as d3 from "d3"; 
import ReactDOM from "react-dom";
import _ from "lodash"; 
import WeatherData from "./seattle-weather.csv"; 

import PeripheryPlots, {
    LineGroup, 
    BarGroup,
    ScatterGroup,
    EventGroup,
    MovingAverageEnvelopeGroup,
    QuantitativeTraceGroup,
    NominalTraceGroup,
    AverageLine
} from "./components/Wrappers/Root.js"; 

import validateConfig from "./util/configValidation.js"; 

import "./css/teststyles.css"; 

let data = []; 
let indexMap = {}; 
let catKeys = ['weather']; 
let floatKeys = ['precipitation', 'temp_max', 'temp_min', 'wind']; 
for (let i = 0; i < WeatherData.length - 1; i++) {
    let row = WeatherData[i]; 
    if (i === 0) {
        // Determine the index for each of the target keys to extract
        for (let j = 0; j < row.length; j++) {
            indexMap[row[j]] = j; 
        }
    } else {
        let datarow = {}; 
        for (let key of floatKeys) {
            datarow[key] = parseFloat(row[indexMap[key]]); 
        }
        for (let key of catKeys) {
            datarow[key] = row[indexMap[key]]; 
        }
        datarow.date = new Date(row[indexMap.date]); 
        data.push(datarow); 
    }
}

let dateExtent = d3.extent(data.map(d => d.date)); 

let config = {

    // Parameters to construct tracks
    trackwiseObservations: [data, data, data, data],
    trackwiseTimeKeys: ['date', 'date', 'date', 'date'], 
    trackwiseValueKeys: ['temp_max', 'precipitation', 'wind', 'weather'], 
    trackwiseTypes: ['continuous', 'continuous', 'continuous', 'discrete'],
    trackwiseUnits: ['celsius', 'inches', 'km / hr', null],
    trackwiseNumAxisTicks: [3, 3, 3, null], 
    trackwiseAxisTickFormatters: [d3.format(",.1f"), null, d3.format(",.1f"), null], 
    trackwiseEncodings: [
        [
            [QuantitativeTraceGroup, AverageLine], [LineGroup, AverageLine], [QuantitativeTraceGroup, AverageLine]
        ], 
        [
            [BarGroup, AverageLine], [BarGroup, AverageLine], [BarGroup, AverageLine]
        ], 
        [
            [ScatterGroup, AverageLine], [LineGroup, AverageLine], [ScatterGroup, AverageLine]
        ], 
        [
            [NominalTraceGroup], [EventGroup], [NominalTraceGroup]
        ]
    ],
    applyContextEncodingsUniformly: true, 
    numContextsPerSide: 1, 

    // Parameters to construct control 
    tickInterval: d3.timeMonth.every(6), 
    timeExtentDomain: dateExtent,  
    timeDomains: [
        ['02/02/2012', '02/01/2013'].map(dateStr => new Date(dateStr)),
        ['02/02/2013', '02/01/2014'].map(dateStr => new Date(dateStr)),
        ['02/02/2014', '02/01/2015'].map(dateStr => new Date(dateStr)) 
    ], 

    // Layout / Style attributes 
    contextWidthRatio: .2, 

    // Optional attributes 
    containerBackgroundColor: 'white',
    focusColor: '#576369', 
    contextColor: '#9bb1ba', 
    lockActiveColor: '#00496e', 
    lockInactiveColor: 'grey', 
    
    containerPadding: 14, 
    controlTimelineHeight: 50, 
    verticalAlignerHeight: 30, 
    axesWidth: 40, 
    trackHeight: 50, 
    trackSvgOffsetTop: 10, 
    trackSvgOffsetBottom: 3,

    // Other 
    dZoom: 10

}; 

validateConfig(config); 

ReactDOM.render(
    <PeripheryPlots {...config}/>, 
    document.getElementById('ROOT')
);





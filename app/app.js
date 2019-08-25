import React from "react"; 
import * as d3 from "d3"; 
import ReactDOM from "react-dom";
import _ from "lodash"; 

import LineGroup from "./encodings/TVPE/LineGroup.jsx"; 
import BarGroup from "./encodings/TVPE/BarGroup.jsx"; 
import ScatterGroup from "./encodings/TVPE/ScatterGroup.jsx"; 
import EventGroup from "./encodings/TVPE/EventGroup.jsx"; 
import MovingAverageEnvelopeGroup from "./encodings/TVPE/MovingAverageEnvelopeGroup.jsx"; 
import QuantitativeTraceGroup from "./encodings/VPE/QuantitativeTraceGroup.jsx"; 
import NominalTraceGroup from "./encodings/VPE/NominalTraceGroup.jsx"; 
import AverageLine from "./encodings/VPE/AverageLine.jsx"; 
import PeripheryPlots from "./components/PeripheryPlots.jsx";

import validateConfig from "./util/configValidation.js"; 

let data = []; 
function processRow(row) {
    if (row && row.date) {
        row.date = new Date(row.date); 
        let floatKeys = ['precipitation', 'temp_max', 'temp_min', 'wind']; 
        for (let key of floatKeys) row[key] = parseFloat(row[key]); 
        data.push(row); 
    }
}

d3.csv('../data/seattle-weather.csv', processRow)
  .then(() => {

    let dateExtent = d3.extent(data.map(d => d.date)); 

    let config = {

        // Parameters to construct tracks
        trackwiseObservations: [data, data, data, data],
        trackwiseTimeKeys: ['date', 'date', 'date', 'date'], 
        trackwiseValueKeys: ['temp_max', 'precipitation', 'wind', 'weather'], 
        trackwiseTypes: ['continuous', 'continuous', 'continuous', 'discrete'],
        trackwiseUnits: ['celsius', 'inches', 'km / hr', null],
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
                NominalTraceGroup, EventGroup, NominalTraceGroup
            ]
        ],
        applyContextsUniformly: false, 
        numContextsPerSide: 1, 

        // Parameters to construct control 
        timeExtentDomain: dateExtent,  
        timeDomains: [
            ['02/02/2012', '02/01/2013'].map(dateStr => new Date(dateStr)),
            ['02/02/2013', '02/01/2014'].map(dateStr => new Date(dateStr)),
            ['02/02/2014', '02/01/2015'].map(dateStr => new Date(dateStr)) 
        ], 

        contextWidthRatio: .3, 

        // Optional attributes 
        containerBackgroundColor: '#ebebeb',
        containerPadding: 10, 
        controlTimelineHeight: 50, 
        verticalAlignerHeight: 30, 
        axesWidth: 40, 
        trackHeight: 50, 
        trackSvgOffsetTop: 10, 
        trackSvgOffsetBottom: 0

    }; 

    validateConfig(config); 

    ReactDOM.render(
        <PeripheryPlots config={config}/>, 
        document.getElementById('ROOT')
    );

  });




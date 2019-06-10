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
import VistaViewer from "./components/VistaViewer.jsx";

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

    // Testing with 3 tracks 
    let config = {

        // Parameters to construct tracks
        trackwiseObservations: [data, data, data, data],
        trackwiseTimeKeys: ['date', 'date', 'date', 'date'], 
        trackwiseValueKeys: ['temp_max', 'precipitation', 'wind', 'weather'], 
        trackwiseUnits: ['celsius', 'inches', 'km / hr', null],
        trackwiseEncodings: [
            [
                [QuantitativeTraceGroup, AverageLine], 
                [QuantitativeTraceGroup, AverageLine], 
                [LineGroup, AverageLine], 
                [QuantitativeTraceGroup, AverageLine],
                [QuantitativeTraceGroup, AverageLine] 
            ], 
            [
                [BarGroup, AverageLine],
                [BarGroup, AverageLine], 
                [BarGroup, AverageLine], 
                [BarGroup, AverageLine],
                [BarGroup, AverageLine]
            ], 
            [
                [ScatterGroup, AverageLine],
                [ScatterGroup, AverageLine], 
                [LineGroup, AverageLine], 
                [ScatterGroup, AverageLine],
                [ScatterGroup, AverageLine]
            ], 
            [
                NominalTraceGroup,
                NominalTraceGroup, 
                EventGroup, 
                NominalTraceGroup,
                NominalTraceGroup
            ]
        ],

        // Parameters to construct control 
        timeExtentDomain: dateExtent,  
        timeDomains: [
            ['01/01/2012', '09/01/2012'].map(dateStr => new Date(dateStr)),
            ['09/02/2012', '11/01/2013'].map(dateStr => new Date(dateStr)),
            ['11/02/2013', '05/01/2014'].map(dateStr => new Date(dateStr)),
            ['05/02/2014', '11/01/2014'].map(dateStr => new Date(dateStr)),
            ['11/02/2014', '4/05/2015'].map(dateStr => new Date(dateStr))
        ],
    }; 

    ReactDOM.render(
        <VistaViewer config={config}/>, 
        document.getElementById('ROOT')
    );

  });




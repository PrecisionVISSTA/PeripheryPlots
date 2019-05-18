import React from "react"; 
import * as d3 from "d3"; 
import ReactDOM from "react-dom";
import _ from "lodash"; 

import LineGroup from "./encodings/TVPE/LineGroup.jsx"; 
import BarGroup from "./encodings/TVPE/BarGroup.jsx"; 
import ScatterGroup from "./encodings/TVPE/ScatterGroup.jsx"; 
import EventGroup from "./encodings/TVPE/EventGroup.jsx"; 
import MovingAverageEnvelopeGroup from "./encodings/TVPE/MovingAverageEnvelopeGroup.jsx"; 

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
        trackwiseValueKeys: ['precipitation', 'temp_max', 'temp_min', 'weather'], 
        trackwiseEncodings: [
            [LineGroup, MovingAverageEnvelopeGroup, ScatterGroup], 
            [LineGroup, BarGroup, ScatterGroup], 
            [LineGroup, MovingAverageEnvelopeGroup, ScatterGroup], 
            [EventGroup, EventGroup, EventGroup]
        ], 
        trackwiseAxes: [
            { 
                time: { type: 'quantitative' }, 
                value: { type: 'quantitative' }
            },
            { 
                time: { type: 'quantitative' }, 
                value: { type: 'quantitative' }
            },
            { 
                time: { type: 'quantitative' }, 
                value: { type: 'quantitative' }
            },
            { 
                time: { type: 'quantitative' }, 
                value: { type: 'nominal' }
            }
        ], 

        // Parameters to construct control 
        timeExtentDomain: dateExtent,  
        timeDomains: [
            ['02/02/2012', '02/01/2013'].map(dateStr => new Date(dateStr)),
            ['02/02/2013', '02/01/2014'].map(dateStr => new Date(dateStr)),
            ['02/02/2014', '02/01/2015'].map(dateStr => new Date(dateStr)) 
        ],
    }; 
    
    ReactDOM.render(
        <VistaViewer config={config}/>, 
        document.getElementById('ROOT')
    );

  });




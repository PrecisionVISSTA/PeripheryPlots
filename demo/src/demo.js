import React from "react"; 
import { timeMonth } from 'd3-time';  
import { format } from 'd3-format';
import { extent } from 'd3-array'; 
import ReactDOM from "react-dom";
import _ from "lodash"; 
import loadData from "./loadData"; 

import PeripheryPlots, {
    LineGroup, 
    BarGroup,
    ScatterGroup,
    EventGroup,
    QuantitativeTraceGroup,
    NominalTraceGroup,
    AverageLineGroup
} from "../../src/index.js"; 

let data = loadData(); 

let config = {

    trackwiseObservations: [data, data, data, data],
    trackwiseTimeKeys: ['date', 'date', 'date', 'date'], 
    trackwiseValueKeys: ['temp_max', 'precipitation', 'wind', 'weather'], 
    trackwiseTypes: ['continuous', 'continuous', 'continuous', 'discrete'],
    trackwiseUnits: ['celsius', 'inches', 'km / hr', null],
    trackwiseNumAxisTicks: [3, 3, 3, null], 
    trackwiseAxisTickFormatters: [format(",.1f"), null, format(",.1f"), null], 
    trackwiseEncodings: [
        [
            [QuantitativeTraceGroup, AverageLineGroup], [LineGroup, AverageLineGroup], [QuantitativeTraceGroup, AverageLineGroup]
        ], 
        [
            [BarGroup, AverageLineGroup], [BarGroup, AverageLineGroup], [BarGroup, AverageLineGroup]
        ], 
        [
            [ScatterGroup, AverageLineGroup], [LineGroup, AverageLineGroup], [ScatterGroup, AverageLineGroup]
        ], 
        [
            [NominalTraceGroup], [EventGroup], [NominalTraceGroup]
        ]
    ],
    contextWidthRatio: .15, 
    numContextsPerSide: 2, 
    applyContextEncodingsUniformly: true,
    tickInterval: timeMonth.every(3), 
    timeExtentDomain: extent(data.map(d => d.date)),  
    timeDomains: [
        ['03/02/2012', '07/02/2012'].map(dateStr => new Date(dateStr)),
        ['07/02/2012', '02/01/2013'].map(dateStr => new Date(dateStr)),
        ['02/02/2013', '02/01/2014'].map(dateStr => new Date(dateStr)),
        ['02/02/2014', '02/01/2015'].map(dateStr => new Date(dateStr)),
        ['02/01/2015', '06/01/2015'].map(dateStr => new Date(dateStr)) 
    ], 

    // lockOutlineColor: '#ff0000', 
    // handleOutlineColor:  '#ff0000', 
    // brushOutlineColor: '#ff0000'

    // dZoom: 10,
    // containerBackgroundColor: 'white',
    // focusColor: '#576369', 
    // contextColor: '#9bb1ba', 
    // lockActiveColor: '#00496e', 
    // lockInactiveColor: 'grey', 
    // containerPadding: 14, 
    controlTimelineHeight: 70, 
    verticalAlignerHeight: 40, 
    // axesWidth: 40, 
    // trackHeight: 50, 
    // trackSvgOffsetTop: 10, 
    // trackSvgOffsetBottom: 3

}; 

// Date.prototype.addDays = function(days) {
//     var date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
//   }; 
  
//   let d0 = new Date("06/22/1997"); 
  
//   let data = []; 
//   for (let i = 0; i < 100; i++) {
//     let d = d0.addDays(i); 
//     let o = {
//       'date': d, 
//       'value': Math.random() * 100
//     }; 
//     data.push(o); 
//   }
  
//   let config = {
  
//     trackwiseObservations: [data],
//     trackwiseTimeKeys: ['date'], 
//     trackwiseValueKeys: ['value'], 
//     trackwiseTypes: ['continuous'],
//     trackwiseUnits: [null],
//     trackwiseNumAxisTicks: [4], 
//     trackwiseAxisTickFormatters: [null], 
//     trackwiseEncodings: [
//         [
//             [LineGroup], [LineGroup], [LineGroup]
//         ]
//     ],
//     applyContextEncodingsUniformly: true,
//     tickInterval: timeDay.every(20), 
//     timeExtentDomain: extent(data.map(d => d.date)),  
//     timeDomains: [
//         [d0, d0.addDays(20)],
//         [d0.addDays(20), d0.addDays(60)],
//         [d0.addDays(60), d0.addDays(80)] 
//     ]
  
//   }; 

ReactDOM.render(
    <React.Fragment>
        <div>
            <p>A small sample dataset from the {<a href={'https://github.com/vega/vega/blob/master/docs/data/seattle-weather.csv'}>Vega</a>} repository</p>
            <p>You can control the selected time zones via the control timeline or via zoom / pan interaction on the focus zones of each track.</p>
            <p>For this demo, the types of visual encodings used are fixed. When using the component in your own applications, you can create custom encodings and change the types of encodings used dynamically.</p>
        </div>
        <PeripheryPlots {...config}/>
    </React.Fragment>
    , 
    document.getElementById('DEMO')
);





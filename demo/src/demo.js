import React from "react"; 
import ReactDOM from "react-dom";
import _ from "lodash"; 
// import ContainerizedDemo from "./ContainerizedDemo"; 
import DistributedDemo from "./DistributedDemo"; 

// import PeripheryPlots, {
//     LineGroup, 
//     BarGroup,
//     ScatterGroup,
//     EventGroup,
//     MovingAverageEnvelopeGroup, 
//     QuantitativeTraceGroup,
//     NominalTraceGroup,
//     AverageLineGroup
// } from "../../src/index.js"; 

// let distributed_config = {

//     trackwiseObservations: [data, data, data, data],
//     trackwiseTimeKeys: ['date', 'date', 'date', 'date'], 
//     trackwiseValueKeys: ['temp_max', 'precipitation', 'wind', 'weather'], 
//     trackwiseTypes: ['continuous', 'continuous', 'continuous', 'discrete'],
//     trackwiseUnits: ['celsius', 'inches', 'km / hr', null],
//     trackwiseNumAxisTicks: [3, 3, 3, null], 
//     trackwiseAxisTickFormatters: [format(",.1f"), null, format(",.1f"), null], 
//     trackwiseEncodings: [
//         [
//             [QuantitativeTraceGroup, AverageLineGroup], [LineGroup, AverageLineGroup], [QuantitativeTraceGroup, AverageLineGroup]
//         ], 
//         [
//             [BarGroup, AverageLineGroup], [BarGroup, AverageLineGroup], [BarGroup, AverageLineGroup]
//         ], 
//         [
//             [MovingAverageEnvelopeGroup, ScatterGroup, AverageLineGroup], [MovingAverageEnvelopeGroup, ScatterGroup, AverageLineGroup], [MovingAverageEnvelopeGroup, ScatterGroup, AverageLineGroup]
//         ], 
//         [
//             [NominalTraceGroup], [EventGroup], [NominalTraceGroup]
//         ]
//     ],

//     contextWidthRatio: .15, 
//     numContextsPerSide: 1, 
//     applyContextEncodingsUniformly: true,
//     tickInterval: timeMonth.every(3), 
//     timeExtentDomain: extent(data.map(d => d.date)),  
//     msecsPadding: 1000 * 86400 * 14, // two weeks
//     timeDomains: [
//         ['07/02/2012', '02/01/2013'].map(dateStr => new Date(dateStr)),
//         ['02/02/2013', '02/01/2014'].map(dateStr => new Date(dateStr)),
//         ['02/02/2014', '02/01/2015'].map(dateStr => new Date(dateStr))
//     ], 

//     distributedMode: true, 
//     fixedWidth: 600,

//     controlTimelineHeight: 70, 
//     verticalAlignerHeight: 40

// }; 



ReactDOM.render(
    <React.Fragment>
        <div>
            <p>A small sample dataset from the {<a href={'https://github.com/vega/vega/blob/master/docs/data/seattle-weather.csv'}>Vega</a>} repository</p>
            <p>The scale / center of each time "zone" is independently configurable via brushable handles on the control timeline or zoom / pan interactions (scrollwheel / drag) with the corresponding plot. </p>
            <p>For this demo, the types of visual encodings used are fixed. The PeripheryPlots component comes with a number of default visual encodings and it can be easily extended to support custom encodings. </p>
        </div>
        {/* <ContainerizedDemo/> */}
        <DistributedDemo/>
    </React.Fragment>
    , 
    document.getElementById('DEMO')
);





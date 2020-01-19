import React, { useState } from 'react'; 
import { timeMonth } from 'd3-time';  
import { format } from 'd3-format';
import { extent } from 'd3-array'; 
import _ from "lodash"; 
import loadData from "./loadData"; 
import PeripheryPlots, {
            QuantitativeTraceGroup, 
            AverageLineGroup, 
            BarGroup, 
            MovingAverageEnvelopeGroup, 
            ScatterGroup,
            NominalTraceGroup, 
            EventGroup, 
            LineGroup
       } from "../../src/index.js"; 

export default function ContainerizedDemo(props) {

    const [data, setData] = useState(loadData()); 
    const [config, setConfig] = useState({

        trackwiseObservations: [data, data, data],
        trackwiseTimeKeys: ['date', 'date', 'date'], 
        trackwiseValueKeys: ['temp_max', 'precipitation', 'wind'], 
        trackwiseTypes: ['continuous', 'continuous', 'continuous'],
        trackwiseUnits: ['celsius', 'inches', 'km / hr'],
        trackwiseNumAxisTicks: [3, 3, 3], 
        trackwiseAxisTickFormatters: [format(",.1f"), null, format(",.1f")], 
        trackwiseEncodings: [
            [
                [LineGroup], [LineGroup], [LineGroup]
            ], 
            [
                [LineGroup], [LineGroup], [LineGroup]            
            ], 
            [
                [LineGroup], [LineGroup], [LineGroup]            
            ]
        ],
        // trackwiseEncodings: [
        //     [
        //         [QuantitativeTraceGroup, AverageLineGroup], [LineGroup, AverageLineGroup], [QuantitativeTraceGroup, AverageLineGroup]
        //     ], 
        //     [
        //         [BarGroup, AverageLineGroup], [BarGroup, AverageLineGroup], [BarGroup, AverageLineGroup]
        //     ], 
        //     [
        //         [MovingAverageEnvelopeGroup, ScatterGroup, AverageLineGroup], [MovingAverageEnvelopeGroup, ScatterGroup, AverageLineGroup], [MovingAverageEnvelopeGroup, ScatterGroup, AverageLineGroup]
        //     ], 
        //     [
        //         [NominalTraceGroup], [EventGroup], [NominalTraceGroup]
        //     ]
        // ],
    
        contextWidthRatio: .15, 
        numContextsPerSide: 1, 
        applyContextEncodingsUniformly: true,
        tickInterval: timeMonth.every(3), 
        timeExtentDomain: extent(data.map(d => d.date)),  
        msecsPadding: 1000 * 86400 * 14, // two weeks
        timeDomains: [
            ['07/02/2012', '02/01/2013'].map(dateStr => new Date(dateStr)),
            ['02/02/2013', '02/01/2014'].map(dateStr => new Date(dateStr)),
            ['02/02/2014', '02/01/2015'].map(dateStr => new Date(dateStr))
        ], 
    
        controlTimelineHeight: 70, 
        verticalAlignerHeight: 40
    
    }); 

    let updateEncodingType = (type) => {
        let Encoding = type === 'line' ? LineGroup : BarGroup; 
        let encodings = [[Encoding], [Encoding], [Encoding]];
        let new_schema = _.range(0, config.trackwiseEncodings.length).map(i => encodings); 
        let new_config = _.cloneDeep(config); 
        new_config['trackwiseEncodings'] = new_schema; 
        setConfig(new_config);
    }



    return <React.Fragment>
        <button onClick={(e) => updateEncodingType('line')}>line</button>
        <button onClick={(e) => updateEncodingType('bar')}>bar</button>
        <button onClick={(e) => moveTimeZones()}>shift time zones</button>
        <div style={{ width: '100%' }}>
            <PeripheryPlots config={config}/>
        </div>
    </React.Fragment>;

}; 

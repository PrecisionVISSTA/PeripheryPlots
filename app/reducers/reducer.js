
const DEFAULT_state = {
    
    // Component logical properties (dynamic)
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 
    zoomTransform: null, 
    focusBrushWidth: 0, 
    focusMiddleX: 0, // x coordinate of the middle of the focus brush in the control component 
    focusDX: 0, //half the width in the x dimension of the focus brush

    // Component styling properties (static)
    focusColor: '#515151', 
    contextColor: '#aaaaaa', 

    // Component dimension properties (static)
    numContextsPerSide: 1, 
    axesWidth: 40, 
    contextWidth: 100, 
    trackWidth: 700, 
    controlTimelineHeight: 60, 
    controlTimelineWidth: 700, 
    controlTimelineScaleRange: [0,0], 
    trackHeight: 60, 
    trackPaddingTop: 5, 
    trackPaddingBottom: 5, 
    verticalAlignerHeight: 30, 
    padding: 5

};

// Derivation of derived default properties 
DEFAULT_state['focusWidth'] = (function() {
    let { trackWidth, contextWidth, numContextsPerSide, axesWidth } = this; 
    let focusWidth = trackWidth - contextWidth * 2 * numContextsPerSide - axesWidth;
    return focusWidth; 
}).bind(DEFAULT_state)()

const reducer = (state = DEFAULT_state, action) => {
    
    switch (action.type) {
        case 'CHANGE_timeExtentDomain': 
            let { timeExtentDomain } = action; 
            return {
                ...state, 
                timeExtentDomain 
            };
        case 'CHANGE_timeDomains': 
            let { timeDomains } = action; 
            return {
                ...state, 
                timeDomains
            };
        case 'CHANGE_numContextsPerSide': 
            let { numContextsPerSide } = action; 
            return {
                ...state, 
                numContextsPerSide 
            };
        case 'CHANGE_zoomTransform': 
            let { zoomTransform } = action; 
            return {
                ...state, 
                zoomTransform
            };
        case "CHANGE_focusBrushWidth": 
            let { focusBrushWidth } = action; 
            return {
                ...state, 
                focusBrushWidth
            }; 
        case "CHANGE_controlTimelineScaleRange": 
            let { controlTimelineScaleRange } = action; 
            return {
                ...state, 
                controlTimelineScaleRange
            };  
        case "CHANGE_focusMiddleX": 
            let { focusMiddleX } = action; 
            return {
                ...state, 
                focusMiddleX
            };  
        case "CHANGE_focusDX": 
            let { focusDX } = action; 
            return {
                ...state, 
                focusDX
            };  
        default:
            return state;
    }
};

export default reducer;

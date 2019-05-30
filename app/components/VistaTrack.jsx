import React from "react"; 
import * as d3 from "d3"; 
import _ from "lodash"; 
import { connect } from "react-redux";
import { scaleRangeToBox } from "../util/util"; 

import {    ACTION_CHANGE_zoomTransform, 
            ACTION_CHANGE_focusMiddleX, 
            ACTION_CHANGE_focusDX 
        } from "../actions/actions"; 

class VistaTrack extends React.Component {

    state = {
        axis: d3.axisRight(), 
        quantitativeScale: d3.scaleLinear(), 
        categoricalScale: d3.scaleBand(), 
        timeScale: d3.scaleTime(), 
        zoom: d3.zoom(), 
        zoomsInitialized: false
    }

    getAnchorBase(s) {
        let focusDX = (s[1] - s[0]) / 2;
        let focusMiddleX = s[0] + focusDX; 
        return { focusDX, focusMiddleX };  
    }

    zoomed = () => {
        // ignore zoom-by-brush
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
            return;
        }
        
        let zoomTransform = d3.zoomTransform(d3.select(this.ZOOM_REF).node());

        let { controlScale, focusMiddleX, focusDX } = this.props;
        let { k } = zoomTransform; 
        let controlRange = controlScale.range(); 
        let isPan = k === this.props.zoomTransform.k; 

        if (isPan) {
            let zoomDX = this.props.zoomTransform.x - zoomTransform.x; 
            focusMiddleX += zoomDX; 
            this.props.ACTION_CHANGE_focusMiddleX(focusMiddleX); 
        } 

        // Construct the new brush dimensions and find the corresponding zoom transformation 
        let kx = k * focusDX; 
        let x0 = focusMiddleX - kx; 
        let x1 = focusMiddleX + kx; 
        let sx = (x1 - x0) / (controlRange[1] - controlRange[0]); 
        let newTransform = d3.zoomIdentity.translate(x0, 0).scale(sx); 

        // Update the global zoom transform with the newly constructed zoom transform 
        this.props.ACTION_CHANGE_zoomTransform(newTransform); 
    }

    initZooms() {
        
        let { timeExtentDomain, timeDomains, trackHeight, trackPaddingBottom, controlScale } = this.props; 
        let { zoom } = this.state; 

        // Time domain corrresponding to the current focus region 
        let controlRange = controlScale.range(); 
        let focusDomain = timeDomains[parseInt(timeDomains.length / 2)]; 
        let focusS = focusDomain.map(controlScale); 
        let focusW = focusS[1] - focusS[0]; 

        // Ensure that the zoom extent is equivalent to the dimensions of the control timeline container 
        let totalW = controlRange[1] - controlRange[0]; 

        // Determine scale / translation factor that maps container range to focus brush initial state
        let scale = focusW / totalW; 
        let translateX = focusS[0]; 

        zoom.on("zoom", this.zoomed)
                                                
        let zoomTransform = d3.zoomIdentity.translate(translateX, 0).scale(scale); 
                                                           
        d3.select(this.ZOOM_REF).call(zoom); 

        let { focusDX, focusMiddleX } = this.getAnchorBase(focusS); 
        
        this.props.ACTION_CHANGE_focusMiddleX(focusMiddleX); 
        this.props.ACTION_CHANGE_focusDX(focusDX);
        this.props.ACTION_CHANGE_zoomTransform(zoomTransform); 
               
    }

    updateAxes() {
        let { axis, quantitativeScale, categoricalScale } = this.state; 
        let { observations, valueKey, trackHeight, trackPaddingTop, trackPaddingBottom } = this.props; 
        let valueDomain = isNaN(observations[0][valueKey]) ? _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d) : 
                                                            d3.extent(observations.map(o => o[valueKey]));
        let isQuantitative = valueDomain.length === 2 && !isNaN(valueDomain[0]) && !isNaN(valueDomain[1]);
        let scale = isQuantitative ? quantitativeScale : categoricalScale; 
        let range = [trackHeight - trackPaddingBottom, trackPaddingTop]; 

        scale.domain(valueDomain).range(range); 
        d3.select(this.AXES_REF).call(isQuantitative ?  axis.scale(scale.nice()).ticks(4) : 
                                                        axis.scale(scale)); 

    }


    componentDidMount() {

        this.updateAxes(); 

        d3.select(this.FOCUS_REF).on('mousemove', () => {

            let [x,y] = d3.mouse(this.FOCUS_REF); 
            d3.selectAll('.focus-time-bar')
              .attr('transform', `translate(${x},0)`); 

            let toLeft = x < (this.props.trackWidth - 2 * this.props.contextWidth) / 2;
            let dText = 3;  

            let currentDate = this.state.timeScale
                                        .domain(this.props.timeDomains[this.props.numContextsPerSide])
                                        .range([0, this.props.focusWidth])
                                        .invert(x);
            let dateString = d3.timeFormat('%B %d, %Y')(currentDate); 

            d3.selectAll('.focus-time-text')
              .attr('display', 'block')
              .attr('transform', `translate(${x + (toLeft ? 1 : -1) * dText},10)`)
              .attr('text-anchor', toLeft ? 'start' : 'end')
              .text(dateString); 

        }); 
        d3.select(this.FOCUS_REF).on('mouseleave', () => {
            d3.selectAll('.focus-time-bar')
              .attr('transform', `translate(${-1},0)`);

            d3.selectAll('.focus-time-text')
                .attr('display', 'none') 
        }); 

    }

    componentDidUpdate(prevProps, prevState) {
        let { zoom, zoomsInitialized } = this.state; 
        let { focusBrushWidth, timeDomains, controlScale } = this.props;

        this.updateAxes(); 

        if (focusBrushWidth > 0 && !zoomsInitialized) {
            this.initZooms(); 
            this.setState({ zoomsInitialized: true }); 
        }

    }

    render() {

        let { 
            title, 
            unit, 
            observations, 
            timeKey, 
            valueKey, 
            timeDomains, 
            numContextsPerSide, 
            encodings, 
            trackWidth, 
            trackHeight, 
            trackPaddingTop, 
            trackPaddingBottom, 
            contextWidth, 
            focusWidth, 
            axesWidth, 
            focusColor, 
            contextColor, 
            padding
        } = this.props; 

        console.log('updating track');

        // utility functions 
        let valueInDomain = (value, domain) => value >= domain[0] && value <= domain[1]; 
        let observationsInDomain = domain => observations.filter(o => valueInDomain(o[timeKey], domain)); 

        // partitioned domains 
        let leftContextTimeDomains = timeDomains.slice(0, numContextsPerSide);
        let focusTimeDomain = timeDomains[numContextsPerSide]; 
        let rightContextTimeDomains = timeDomains.slice(numContextsPerSide + 1, timeDomains.length);
        
        // partitioned encodings
        let leftContextEncodings = encodings.slice(0, numContextsPerSide); 
        let FocusEncoding = encodings[numContextsPerSide]; 
        let rightContextEncodings = encodings.slice(numContextsPerSide + 1, encodings.length); 

        // partitioned observations
        let leftContextObservations = leftContextTimeDomains.map(observationsInDomain);
        let focusObservations = observationsInDomain(focusTimeDomain); 
        let rightContextObservations = rightContextTimeDomains.map(observationsInDomain); 

        let contextScaleRangeToBox = _.partial(scaleRangeToBox, [0, contextWidth], [trackHeight - trackPaddingBottom, trackPaddingTop]); 
        let focusScaleRangeToBox = _.partial(scaleRangeToBox, [0, focusWidth], [trackHeight - trackPaddingBottom, trackPaddingTop]); 

        let tHeight = trackHeight - trackPaddingBottom * 2; 
        let valueDomain = isNaN(observations[0][valueKey]) ? _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d) : 
                                                             d3.extent(observations.map(o => o[valueKey]));

        return (
        <div style={{ width: '100%', padding }}>

            <div style={{ width: "100%", display: "block" }}>
                <p style={{ fontFamily: 'helvetica', fontSize: 12, fontWeight: 'bold', margin: 3 }}>
                    {title.replace("_", ' ') + (unit ? ` (${unit})` : '')}
                </p>
            </div>

            {/* Value Axis */}
            <svg 
            ref={ref => this.AXES_REF = ref} 
            style={{ width: axesWidth, height: trackHeight, marginLeft: 3 }}/>

            {/* Left Contexts */}
            {leftContextTimeDomains.map((timeDomain, i) => {
                let LeftContextEncoding = leftContextEncodings[i]; 
                let clipId = `left-clip-${i}`; 
                return (
                    <svg 
                    key={`left-${i}`}
                    clipPath={`url(#${clipId})`}
                    style={{ width: contextWidth, height: trackHeight, display: 'inline-block' }}>
                        {/* Left context border */}
                        <rect 
                        x={0} 
                        y={trackPaddingTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        stroke={contextColor} 
                        fill='none'/>

                        {/* Left context clip */}
                        <clipPath id={clipId}>
                            <rect 
                            x={0} 
                            y={trackPaddingTop} 
                            width={contextWidth} 
                            height={tHeight}/>
                        </clipPath>

                        {/* Left context visualization */}
                        <LeftContextEncoding
                        key={`left-${i}-inner`}
                        timeKey={timeKey}
                        valueKey={valueKey}
                        timeDomain={timeDomain}
                        valueDomain={valueDomain}
                        observations={leftContextObservations[i]}
                        scaleRangeToBox={contextScaleRangeToBox}/>

                    </svg>
                ); 
            })}

            {/* Focus */}
            <svg 
            ref={ref => this.FOCUS_REF = ref}
            clipPath={`url(#focus-clip)`}
            style={{ width: focusWidth, height: trackHeight, display: 'inline-block' }}>
                {/* Focus Border */}
                <rect 
                x={0} 
                y={trackPaddingTop} 
                width={focusWidth} 
                height={tHeight} 
                stroke={focusColor} 
                fill='none'/>

                {/* Focus clip */}
                <clipPath id="focus-clip">
                    <rect 
                    x={0} 
                    y={trackPaddingTop} 
                    width={focusWidth} 
                    height={tHeight}/>
                </clipPath>

                {/* Focus visualization */}
                <FocusEncoding
                timeKey={timeKey}
                valueKey={valueKey}
                timeDomain={focusTimeDomain}
                valueDomain={valueDomain}
                observations={focusObservations}
                scaleRangeToBox={focusScaleRangeToBox}/>

                {/* Current time point hover bar */}
                <rect
                className="focus-time-bar"
                x={0}
                y={trackPaddingTop + 1}
                width={.1}
                height={tHeight - 2}
                stroke="#515151"/>

                {/* Current time tooltip (only visible when mouse in container) */}
                <text
                className="focus-time-text"
                x={0}
                y={trackPaddingTop + 1}
                fontFamily={'Helvetica'}
                fontSize={10}/>

                {/* Focus zoom panel */}
                <rect 
                ref={ref => this.ZOOM_REF = ref}
                className={`zoom`}
                pointerEvents="all"
                x={0} 
                y={trackPaddingTop} 
                width={focusWidth} 
                height={tHeight} 
                fill='none'/>

            </svg>

            {/* Right Contexts */}
            {rightContextTimeDomains.map((timeDomain, i) => {
                let RightContextEncoding = rightContextEncodings[i]; 
                let clipId = `right-clip-${i}`; 
                return (
                    <svg 
                    key={`right-${i}`}
                    clipPath={`url(#${clipId})`}
                    style={{ width: contextWidth, height: trackHeight, display: 'inline-block' }}>
                        <rect 
                        x={0} 
                        y={trackPaddingTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        stroke={contextColor} 
                        fill='none'/>

                        <clipPath id={clipId}>
                            <rect 
                            x={0} 
                            y={trackPaddingTop} 
                            width={contextWidth} 
                            height={tHeight}/>
                        </clipPath>

                        <RightContextEncoding
                        key={`right-${i}-inner`}
                        timeKey={timeKey}
                        valueKey={valueKey}
                        timeDomain={timeDomain}
                        valueDomain={valueDomain}
                        observations={rightContextObservations[i]}
                        scaleRangeToBox={contextScaleRangeToBox}/>

                    </svg>
                );
            })}
        </div>
        );
    }

}

const mapStateToProps = ({ 
    timeDomains, 
    timeExtentDomain, 
    numContextsPerSide, 
    focusColor, 
    contextColor, 
    focusBrushWidth, 
    focusDX, 
    focusMiddleX, 
    zoomTransform
}) => ({ 
    timeDomains, 
    timeExtentDomain, 
    numContextsPerSide, 
    focusColor, 
    contextColor, 
    focusBrushWidth, 
    focusDX, 
    focusMiddleX, 
    zoomTransform
}); 
                        
const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_zoomTransform: (zoomTransform) => 
        dispatch(ACTION_CHANGE_zoomTransform(zoomTransform)), 

    ACTION_CHANGE_focusMiddleX: (focusMiddleX) => 
        dispatch(ACTION_CHANGE_focusMiddleX(focusMiddleX)), 

    ACTION_CHANGE_focusDX: (focusDX) => 
        dispatch(ACTION_CHANGE_focusDX(focusDX)), 

})

export default connect(mapStateToProps, mapDispatchToProps)(VistaTrack); 
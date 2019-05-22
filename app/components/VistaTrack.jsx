import React from "react"; 
import * as d3 from "d3"; 
import _ from "lodash"; 
import { connect } from "react-redux";
import { scaleRangeToBox } from "../util/util"; 

import { ACTION_CHANGE_zoomTransform } from "../actions/actions"; 

class VistaTrack extends React.Component {

    state = {
        axis: d3.axisRight(), 
        quantitativeScale: d3.scaleLinear(), 
        categoricalScale: d3.scaleBand(), 
        timeScale: d3.scaleTime(), 
        aScale: d3.scaleLinear(), 
        zoom: d3.zoom()
    }

    zoomed = () => {
        // ignore zoom-by-brush
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
            return;
        }
        let zoomTransform = d3.zoomTransform(d3.select('.zoom').node()); 

        this.props.ACTION_CHANGE_zoomTransform(zoomTransform);             
    }

    initZooms() {
        this.state.zoom
            .scaleExtent([1, Infinity])
            .on("zoom", this.zoomed)

        d3.selectAll('.zoom')
            .call(this.state.zoom); 
    }

    updateZooms() {
        let { timeDomains, numContextsPerSide, timeExtentDomain } = this.props; 
        let { aScale, zoom } = this.state; 

        let timelineWidth = 676; 

        aScale.domain(timeExtentDomain).range([0, timelineWidth]);
        
        let tDomain = timeDomains[numContextsPerSide]; 
        let s = tDomain.map(aScale); 

        d3.selectAll('.zoom')
          .call(zoom.transform, d3.zoomIdentity
                                .scale(timelineWidth / (s[1] - s[0]))
                                .translate(-s[0], 0)); 

        let zoomTransform = d3.zoomTransform(d3.select('.zoom').node()); 

        this.props.ACTION_CHANGE_zoomTransform(zoomTransform); 
    }

    updateAxes() {
        let { axis, quantitativeScale, categoricalScale } = this.state; 
        let { observations, valueKey, trackHeight, trackPaddingTop, trackPaddingBottom } = this.props; 

        let valueDomain = isNaN(observations[0][valueKey]) ? _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d) : 
                                                            d3.extent(observations.map(o => o[valueKey]));

        let isQuantitative = valueDomain.length === 2 && !isNaN(valueDomain[0]) && !isNaN(valueDomain[1]); 
        if (isQuantitative) {
            quantitativeScale.domain(valueDomain)
                             .range([trackHeight - trackPaddingBottom, trackPaddingTop]); 
            d3.select(this.AXES_REF)
              .call(axis.scale(quantitativeScale.nice()).ticks(4)); 
        } else {
            categoricalScale.domain(valueDomain)
                            .range([trackHeight - trackPaddingBottom, trackPaddingTop]);
            d3.select(this.AXES_REF)
              .call(axis.scale(categoricalScale));
        }
    }


    componentDidMount() {

        this.updateAxes(); 
        this.initZooms(); 

        d3.select(this.FOCUS_REF).on('mousemove', () => {

            let [x,y] = d3.mouse(this.FOCUS_REF); 
            d3.selectAll('.focus-time-bar')
              .attr('transform', `translate(${x},0)`); 

            let toLeft = x < (this.props.trackWidth - 2*this.props.contextWidth) / 2;
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

    componentDidUpdate() {
        this.updateAxes(); 
        this.updateZooms(); 
    }

    render() {

        let { 
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
            contextColor
        } = this.props; 

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
        <div style={{ width: trackWidth, height: trackHeight }}>

            {/* Value Axis */}
            <svg 
            ref={ref => this.AXES_REF = ref} 
            style={{ width: axesWidth, height: trackHeight }}/>

            {/* Left Contexts */}
            {leftContextTimeDomains.map((timeDomain, i) => {
                let LeftContextEncoding = leftContextEncodings[i]; 
                let clipId = `left-clip-${i}`; 
                return (
                    <svg 
                    key={`left-${i}`}
                    clipPath={`url(#${clipId})`}
                    style={{ width: contextWidth, height: trackHeight }}>
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
            style={{ width: focusWidth, height: trackHeight }}>
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
                    style={{ width: contextWidth, height: trackHeight }}>
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

const mapStateToProps = ({ timeDomains, timeExtentDomain, numContextsPerSide, focusColor, contextColor }) => 
                        ({ timeDomains, timeExtentDomain, numContextsPerSide, focusColor, contextColor }); 

const mapDispatchToProps = dispatch => ({
    ACTION_CHANGE_zoomTransform: (zoomTransform) => 
        dispatch(ACTION_CHANGE_zoomTransform(zoomTransform))
})

export default connect(mapStateToProps, mapDispatchToProps)(VistaTrack); 
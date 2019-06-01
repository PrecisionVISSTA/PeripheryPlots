import React from "react"; 
import * as d3 from "d3"; 
import _ from "lodash"; 
import { connect } from "react-redux";
import { scaleRangeToBox } from "../util/util"; 

import { ACTION_CHANGE_timeDomains } from "../actions/actions"; 

class VistaTrack extends React.Component {

    state = {
        axis: d3.axisRight(), 
        quantitativeScale: d3.scaleLinear(), 
        categoricalScale: d3.scaleBand(), 
        timeScale: d3.scaleTime(), 
        zoom: d3.zoom(), 
        zoomsInitialized: false
    }

    zoomed = () => {
        // ignore zoom-by-brush
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
            return;
        }
        
        let { timeDomains, controlScale } = this.props; 
        let { lastK, lastX } = this.state; 
        let { k, x } = d3.zoomTransform(d3.select(this.ZOOM_REF).node());
        let dZoom = 2; 
        let isPan = lastK === k;      
        let focusIndex = parseInt(timeDomains.length / 2);
        let brushS = timeDomains[focusIndex].map(controlScale);
        let zoomDir = k > lastK ? -1 : 1; 
        let newSelections = timeDomains.map(domain => domain.map(controlScale)); 
        if (isPan) {
            let panShift = x - lastX; 
            newSelections = newSelections.map(s => s.map(v => v + panShift)); 
        } else {
            let leftShift = zoomDir * dZoom; 
            let rightShift = -zoomDir * dZoom; 
            for (let i = 0; i < focusIndex; i++) {
                newSelections[i] = newSelections[i].map(v => v + leftShift); 
            }
            newSelections[focusIndex] = [brushS[0] + leftShift, brushS[1] + rightShift];
            for (let i = focusIndex + 1; i < newSelections.length; i++) {
                newSelections[i] = newSelections[i].map(v => v + rightShift);
            }
        }

        debugger; 
        this.setState({ lastK: k, lastX: x });
        this.props.ACTION_CHANGE_timeDomains(newSelections.map(s => s.map(controlScale.invert)));
        
    }

    initZoom() {
        d3.select(this.ZOOM_REF).call(this.state.zoom.on("zoom", this.zoomed)); 
    }

    updateAxes() {
        let { axis, quantitativeScale, categoricalScale } = this.state; 
        let { observations, valueKey, trackHeight, trackPaddingTop } = this.props; 
        let valueDomain = isNaN(observations[0][valueKey]) ? _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d) : 
                                                            d3.extent(observations.map(o => o[valueKey]));
        let isQuantitative = valueDomain.length === 2 && !isNaN(valueDomain[0]) && !isNaN(valueDomain[1]);
        let scale = isQuantitative ? quantitativeScale : categoricalScale; 
        let range = [trackHeight, trackPaddingTop]; 

        scale.domain(valueDomain).range(range); 
        d3.select(this.AXES_REF).call(isQuantitative ?  axis.scale(scale.nice()).ticks(4) : 
                                                        axis.scale(scale)); 

    }


    componentDidMount() {

        this.updateAxes(); 
        this.initZoom(); 

        let { focusWidth } = this.props; 

        d3.select(this.FOCUS_REF).on('mousemove', () => {

            let [x,y] = d3.mouse(this.FOCUS_REF); 
            d3.selectAll('.focus-time-bar')
              .attr('transform', `translate(${x},0)`); 

            let toLeft = x < (this.props.trackWidth - 2 * this.props.contextWidth) / 2;

            let currentDate = this.state.timeScale
                                        .domain(this.props.timeDomains[this.props.numContextsPerSide])
                                        .range([0, this.props.focusWidth])
                                        .invert(x);

            let dateString = d3.timeFormat('%B %d, %Y')(currentDate); 

            let containerNode = d3.select(this.FOCUS_REF).node();

            d3.selectAll('.focus-time-text').each(function(d,i) {
                let parentNode = this.parentNode; 
                if (parentNode.isEqualNode(containerNode)) {
                    let textS = d3.select(this).text(dateString); 
                    let textBbox = this.getBBox();
                    let textW = textBbox.width; 
                    let textX = textBbox.x; 
                    let dx = textW / 2; 
                    let tx = x + (toLeft ? -1 : 1) * dx; //Proposed x translation
                    let [newX0, newX1] = [textX + tx, textX + textW + tx]; //x bounds post proposed translation
                    if (newX0 < 0) {
                        // this translation would cause the text to be cutoff to the left 
                        tx += -newX0;                       
                    } else if (newX1 > focusWidth) {
                        // this translation would cause the text to be cutoff to the right 
                        tx += -(newX1 - focusWidth); 
                    } else {
                        tx += (toLeft ? 1 : -1) * dx; 
                    }
                    textS
                        .attr('display', 'block')
                        .attr('transform', `translate(${tx},10)`)
                }
            }); 

        }); 
        d3.select(this.FOCUS_REF).on('mouseleave', () => {
            d3.selectAll('.focus-time-bar')
              .attr('transform', `translate(${-1},0)`);
            d3.selectAll('.focus-time-text')
                .attr('display', 'none') 
        }); 

    }

    componentDidUpdate(prevProps, prevState) {
        this.updateAxes(); 
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
            trackHeight, 
            trackPaddingTop, 
            contextWidth, 
            focusWidth, 
            axesWidth, 
            focusColor, 
            contextColor, 
            padding
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

        let multipleFocusEncodings = Array.isArray(FocusEncoding); 

        // partitioned observations
        let leftContextObservations = leftContextTimeDomains.map(observationsInDomain);
        let focusObservations = observationsInDomain(focusTimeDomain); 
        let rightContextObservations = rightContextTimeDomains.map(observationsInDomain); 

        let contextXRange = [0, contextWidth];
        let contextYRange = [trackHeight, trackPaddingTop];  
        let focusXRange = [0, focusWidth]; 
        let focusYRange = [trackHeight, trackPaddingTop];
        let contextScaleRangeToBox = _.partial(scaleRangeToBox, contextXRange, contextYRange); 
        let focusScaleRangeToBox = _.partial(scaleRangeToBox, focusXRange, focusYRange); 

        let tHeight = trackHeight - trackPaddingTop; 
        let valueDomain = isNaN(observations[0][valueKey]) ? _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d) : 
                                                             d3.extent(observations.map(o => o[valueKey]));

        let containerWidth = focusWidth + numContextsPerSide * contextWidth * 2 + axesWidth + padding; 

        return (
        <div style={{ width: containerWidth, paddingLeft: padding, paddingRight: padding, marginBottom: 1, border: '1px solid grey' }}>

            <div style={{ width: "100%", display: "block" }}>
                <p style={{ fontFamily: 'helvetica', fontSize: 12, fontWeight: 'bold', marginTop: 3, marginBottom: 3 }}>
                    {title.replace("_", ' ') + (unit ? ` (${unit})` : '')}
                </p>
            </div>

            {/* Value Axis */}
            <svg 
            ref={ref => this.AXES_REF = ref} 
            style={{ width: axesWidth, height: trackHeight }}/>

            {/* Left Contexts */}
            {leftContextTimeDomains.map((timeDomain, i) => {
                let LeftContextEncoding = leftContextEncodings[i]; 
                let multipleEncodings = Array.isArray(LeftContextEncoding); 
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

                        {/* Left context visualization(s) */}
                        {multipleEncodings ? 
                            LeftContextEncoding.map((LayeredEncoding,j) => 
                                <LayeredEncoding
                                key={`left-${i}-${j}-inner`}
                                timeKey={timeKey}
                                valueKey={valueKey}
                                timeDomain={timeDomain}
                                valueDomain={valueDomain}
                                observations={leftContextObservations[i]}
                                scaleRangeToBox={contextScaleRangeToBox}
                                xRange={contextXRange}
                                yRange={contextYRange}/>
                            ) 
                            :
                            <LeftContextEncoding
                            key={`left-${i}-inner`}
                            timeKey={timeKey}
                            valueKey={valueKey}
                            timeDomain={timeDomain}
                            valueDomain={valueDomain}
                            observations={leftContextObservations[i]}
                            scaleRangeToBox={contextScaleRangeToBox}
                            xRange={contextXRange}
                            yRange={contextYRange}/> 
                        }
                    </svg>
                ); 
            })}

            {/* Focus */}
            <svg 
            ref={ref => this.FOCUS_REF = ref}
            style={{ width: focusWidth, height: trackHeight, display: 'inline-block' }}>

                <defs>
                    {/* Focus clip */}
                    <clipPath id="focus-clip">
                        <rect 
                        x={0} 
                        y={trackPaddingTop} 
                        width={focusWidth} 
                        height={tHeight}/>
                    </clipPath>
                </defs>

                <g clipPath={`url(#focus-clip)`}>
                    {/* Focus Border */}
                    <rect 
                    x={0} 
                    y={trackPaddingTop} 
                    width={focusWidth} 
                    height={tHeight} 
                    stroke={focusColor} 
                    fill='none'/>

                    {/* Focus visualization(s) */}
                    {multipleFocusEncodings ? 
                        FocusEncoding.map((LayeredEncoding,j) => 
                            <LayeredEncoding
                            key={`focus-${j}`}
                            timeKey={timeKey}
                            valueKey={valueKey}
                            timeDomain={focusTimeDomain}
                            valueDomain={valueDomain}
                            observations={focusObservations}
                            scaleRangeToBox={focusScaleRangeToBox}
                            xRange={focusXRange}
                            yRange={focusYRange}/>
                        )
                        :
                        <FocusEncoding
                        timeKey={timeKey}
                        valueKey={valueKey}
                        timeDomain={focusTimeDomain}
                        valueDomain={valueDomain}
                        observations={focusObservations}
                        scaleRangeToBox={focusScaleRangeToBox}
                        xRange={focusXRange}
                        yRange={focusYRange}/>
                    }

                    {/* Current time point hover bar */}
                    <rect
                    className="focus-time-bar"
                    x={0}
                    y={trackPaddingTop + 1}
                    width={.1}
                    height={tHeight - 2}
                    stroke="#515151"/>

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

                </g>

                {/* Current time tooltip (only visible when mouse in container) */}
                <text
                className="focus-time-text"
                x={0}
                y={-2}
                fontFamily={'Helvetica'}
                fill={'black'}
                stroke={'white'}
                strokeWidth={.2}
                fontSize={8}
                textAnchor="middle"/>

                
            </svg>

            {/* Right Contexts */}
            {rightContextTimeDomains.map((timeDomain, i) => {
                let RightContextEncoding = rightContextEncodings[i]; 
                let multipleEncodings = Array.isArray(RightContextEncoding); 
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

                        {/* Right context visualization(s) */}
                        {multipleEncodings ? 
                            RightContextEncoding.map((LayeredEncoding, j) => 
                                <LayeredEncoding
                                key={`right-${i}-${j}-inner`}
                                timeKey={timeKey}
                                valueKey={valueKey}
                                timeDomain={timeDomain}
                                valueDomain={valueDomain}
                                observations={rightContextObservations[i]}
                                scaleRangeToBox={contextScaleRangeToBox}
                                xRange={contextXRange}
                                yRange={contextYRange}/>
                            ) 
                            :
                            <RightContextEncoding
                            key={`right-${i}-inner`}
                            timeKey={timeKey}
                            valueKey={valueKey}
                            timeDomain={timeDomain}
                            valueDomain={valueDomain}
                            observations={rightContextObservations[i]}
                            scaleRangeToBox={contextScaleRangeToBox}
                            xRange={contextXRange}
                            yRange={contextYRange}/>
                        }       
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
    padding
}) => ({ 
    timeDomains, 
    timeExtentDomain, 
    numContextsPerSide, 
    focusColor, 
    contextColor, 
    padding
}); 
                        
const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_timeDomains: (timeDomains) => 
        dispatch(ACTION_CHANGE_timeDomains(timeDomains))

})

export default connect(mapStateToProps, mapDispatchToProps)(VistaTrack); 
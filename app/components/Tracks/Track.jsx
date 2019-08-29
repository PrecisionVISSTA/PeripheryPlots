import React from "react"; 
import * as d3 from "d3"; 
import _ from "lodash"; 
import { connect } from "react-redux";
import { scaleRangeToBox } from "../../util/util"; 

import { ACTION_CHANGE_proposal } from "../../actions/actions"; 

class Track extends React.Component {

    state = {
        axis: d3.axisRight(), 
        quantitativeScale: d3.scaleLinear(), 
        categoricalScale: d3.scaleBand(), 
        timeScale: d3.scaleTime(), 
        zoom: d3.zoom(), 
        zoomsInitialized: false, 
        formatter: d3.timeFormat('%B %d, %Y'), 
        proposalId: 0, 
        lastK: 1, 
        lastX: 0
    }

    zoomed = () => {
        // ignore zoom-by-brush
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
            return;
        }

        let { lastK, lastX, proposalId } = this.state; 
        let { k, x } = d3.zoomTransform(d3.select(this.ZOOM_REF).node());
        let dZoom = 2; 
        let isPan = lastK === k;      
        let zoomDir = k > lastK ? -1 : 1; 
        let newProposalId = proposalId + 1; 
        let proposal = { 
            id: proposalId + 1, 
            type: isPan ? 'pan' : 'zoom', 
            shift: isPan ? x - lastX : undefined, 
            dl: !isPan ? zoomDir * dZoom : undefined, 
            dr: !isPan ? -zoomDir * dZoom : undefined
        }; 

        if ((isPan && lastX !== x) || lastK !== k) {
            this.setState({ lastK: k, lastX: x, proposalId: newProposalId });
            this.props.ACTION_CHANGE_proposal(proposal);
        }
        
        this.updateTooltip();
    }

    initZoom() {
        d3.select(this.ZOOM_REF).call(this.state.zoom.on("zoom", this.zoomed)); 
    }

    updateAxes() {
        let { axis, quantitativeScale, categoricalScale } = this.state; 
        let { observations, valueKey, trackHeight, trackSvgOffsetTop, trackSvgOffsetBottom, type, numAxisTicks, axisTickFormatter } = this.props; 
        
        if (axisTickFormatter) {
            axis.tickFormat(axisTickFormatter); 
        }

        let valueDomain;
        let scale; 
        let applyScaleToAxis; 
        switch (type) {
            case 'discrete': 
                valueDomain = _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d); 
                scale = categoricalScale; 
                applyScaleToAxis = scale => axis.scale(scale);
                break; 
            case 'continuous': 
                valueDomain = d3.extent(observations.map(o => o[valueKey])); 
                scale = quantitativeScale; 
                applyScaleToAxis = scale => axis.scale(scale.nice()).ticks(numAxisTicks ? numAxisTicks : 4); 
                break; 
            case 'other': 
                break; 

        }
        
        if (type !== 'other') {
            applyScaleToAxis(
                scale.domain(valueDomain)
                     .range([trackHeight - trackSvgOffsetBottom - 1, trackSvgOffsetTop])
            ); 
            d3.select(this.AXES_REF).call(axis);
        }
         
    }

    updateTooltip = () => {

        let { focusWidth, numContextsPerSide, contextWidth, trackWidth, timeDomains } = this.props;
        let { formatter, timeScale } = this.state;  

        let [x,y] = d3.mouse(this.FOCUS_REF); 
        d3.selectAll('.focus-time-bar')
          .attr('transform', `translate(${x},0)`); 

        // True if mouse in left half of container 
        let toLeft = x < focusWidth / 2;

        let currentDate = timeScale
                            .domain(timeDomains[numContextsPerSide])
                            .range([0, focusWidth])
                            .invert(x);

        let dateString = formatter(currentDate); 

        let containerNode = d3.select(this.FOCUS_REF).node();

        d3.selectAll('.focus-time-text').each(function(d,i) {
            let parentNode = this.parentNode; 
            if (parentNode.isEqualNode(containerNode)) {
                let textS = d3.select(this).text(dateString); 
                let textBbox = this.getBBox();
                let textW = textBbox.width; 
                let propBbox = [x - textW / 2, x + textW / 2]; 
                if (propBbox[0] < 0) {
                    propBbox = propBbox.map(v => v + -propBbox[0]); 
                } else if (propBbox[1] > focusWidth) {
                    propBbox = propBbox.map(v => v + -(propBbox[1] - focusWidth)); 
                } 
                let newX = (propBbox[1] + propBbox[0]) / 2; 
                textS
                    .attr('display', 'block')
                    .attr('transform', `translate(${newX},10)`)
            }
        }); 

    }

    removeTooltip = () => {
        d3.selectAll('.focus-time-bar')
            .attr('transform', `translate(${-1},0)`);
            
        d3.selectAll('.focus-time-text')
            .attr('display', 'none') 
    }

    componentDidMount() {

        this.updateAxes(); 
        this.initZoom(); 

        d3.select(this.FOCUS_REF).on('mousemove', this.updateTooltip); 
        d3.select(this.FOCUS_REF).on('mouseleave', this.removeTooltip); 

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
            trackSvgOffsetTop,
            trackSvgOffsetBottom, 
            axesWidth, 
            focusColor, 
            contextColor, 
            containerPadding, 
            focusWidth, 
            contextWidth, 
            baseWidth
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
        let contextYRange = [trackHeight - trackSvgOffsetBottom, trackSvgOffsetTop];  
        let focusXRange = [0, focusWidth]; 
        let focusYRange = [trackHeight - trackSvgOffsetBottom, trackSvgOffsetTop];
        let contextScaleRangeToBox = _.partial(scaleRangeToBox, contextXRange, contextYRange); 
        let focusScaleRangeToBox = _.partial(scaleRangeToBox, focusXRange, focusYRange); 

        let tHeight = trackHeight - trackSvgOffsetTop - trackSvgOffsetBottom; 
        let valueDomain = isNaN(observations[0][valueKey]) ? _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d) : 
                                                             d3.extent(observations.map(o => o[valueKey]));

        // namespace for periphery plot specific properties 
        // let pplot = {
        //     timeKey,
        //     valueKey,
        //     timeDomain,
        //     valueDomain,
        //     observations,
        //     scaleRangeToBox,
        //     xRange,
        //     yRange,
        //     doFlip,
        // }; 
                        
        return (
        <div style={{ width: baseWidth, paddingLeft: containerPadding, paddingRight: containerPadding }}>

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
                    
                    style={{ width: contextWidth, height: trackHeight, display: 'inline-block' }}>
                        {/* Dates below chart */}
                        {/* <g transform={`translate(0,${contextYRange[0] + 5})`}>
                            <text 
                            textAnchor="middle">{leftDates[i]}</text>
                        </g> */}

                        {/* Left context border */}
                        <rect 
                        x={0} 
                        y={trackSvgOffsetTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        stroke={contextColor} 
                        fill='none'/>

                        {/* Left context clip */}
                        <clipPath id={clipId}>
                            <rect 
                            x={0} 
                            y={trackSvgOffsetTop} 
                            width={contextWidth} 
                            height={tHeight}/>
                        </clipPath>

                        <g clipPath={`url(#${clipId})`}>
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
                                    yRange={contextYRange}
                                    doFlip={true}/>
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
                                yRange={contextYRange}
                                doFlip={true}/> 
                            }
                        </g>

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
                        y={trackSvgOffsetTop} 
                        width={focusWidth} 
                        height={tHeight}/>
                    </clipPath>
                </defs>

                <g clipPath={`url(#focus-clip)`}>
                    {/* Focus Border */}
                    <rect 
                    x={0} 
                    y={trackSvgOffsetTop} 
                    width={focusWidth} 
                    height={tHeight} 
                    stroke={focusColor} 
                    fill='none'/>

                    {/* Focus visualization(s) */}
                    {FocusEncoding.map((LayeredEncoding,j) => 
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
                    )}

                    {/* Current time point hover bar */}
                    <rect
                    className="focus-time-bar"
                    x={0}
                    y={trackSvgOffsetTop + 1}
                    width={.1}
                    height={tHeight - 2}
                    stroke="#515151"/>

                    {/* Focus zoom panel */}
                    <rect 
                    ref={ref => this.ZOOM_REF = ref}
                    className={`zoom`}
                    pointerEvents="all"
                    x={0} 
                    y={trackSvgOffsetTop} 
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
                        y={trackSvgOffsetTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        stroke={contextColor} 
                        fill='none'/>

                        <clipPath id={clipId}>
                            <rect 
                            x={0} 
                            y={trackSvgOffsetTop} 
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
    focusColor, 
    contextColor, 
    containerPadding, 
    focusWidth, 
    contextWidth, 
    trackWidth, 
    trackHeight, 
    trackSvgOffsetTop, 
    trackSvgOffsetBottom, 
    axesWidth, 
    numContextsPerSide, 
    baseWidth
}) => ({ 
    timeDomains, 
    timeExtentDomain, 
    focusColor, 
    contextColor, 
    containerPadding,
    focusWidth, 
    contextWidth, 
    trackWidth, 
    trackHeight, 
    trackSvgOffsetTop, 
    trackSvgOffsetBottom, 
    axesWidth, 
    numContextsPerSide, 
    baseWidth
}); 
                        
const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_proposal: (proposal) => 
        dispatch(ACTION_CHANGE_proposal(proposal))

})

export default connect(mapStateToProps, mapDispatchToProps)(Track); 
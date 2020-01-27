import React from "react";
import { connect } from "react-redux"; 
import { select, selectAll, event as d3event } from 'd3-selection'; 
import { scaleTime } from 'd3-scale'; 
import { axisBottom } from 'd3-axis'; 
import { brushX, brushSelection } from 'd3-brush'; 
import { transition } from 'd3-transition'; 
import { easeLinear } from 'd3-ease'; 
import _ from "lodash"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 

import  { computeActionFromSelectionTransition, 
          functionFromAction, 
          performShifts
        } from "./TimelineControlUtility";
        
import { CONTROL_CONFIGURATION } from "./TimelineControlConfiguration"; 

import { ACTION_CHANGE_timeDomains } from "../../actions/actions"; 
       
const {
  MARGIN,
  LOCK_WIDTH, 
  LOCK_HEIGHT,  
  HANDLE_WIDTH, 
  HANDLE_HEIGHT, 
  MIN_CONTEXT_WIDTH, 
  MIN_FOCUS_WIDTH
} = CONTROL_CONFIGURATION;

const tupdif = tup => tup[1] - tup[0]; 

function assert(condition, errMsg) {
  if (!condition) {
    throw new Error(errMsg);
  }
}

class TimelineControl extends React.Component {

  state = {
    brushes: [],        //collection of d3 brush objects 
    brushIds: [],       // Collection of brush ids for selection 
    brushLocks: [],     // Collection of booleans to indicate whether or not a brush is locked 
    brushLockIds: [],   // Collection of ids to reference brush lock ids 
    numBrushes: 0,      // The total number of brushes 
    brushHeight: 0,     // The vertical height of the brush 
    brushRanges: [],    // The current selected regions for all brushes in pixel space 
    timelineScale: scaleTime(), 
    timelineAxis: axisBottom() 
  }

  constructor(props) {

    super(props); 

    let { height, timeDomains } = this.props; 

    // Infer the number of brushes 
    this.state.numBrushes = timeDomains.length; 

    // Infer focus index
    this.state.focusIndex = parseInt(this.state.numBrushes / 2); 
    
    let brushIndexList = _.range(0, this.state.numBrushes); 

    // The currently selected brush areas (pixels)
    this.state.brushRanges = this.props.timeDomains.map(domain => domain.map(this.props.controlScale)); 

    // Initialize the brushes 
    this.state.brushes = brushIndexList.map(i => brushX()); 

    // Initialize a collection of ids for the brushes 
    this.state.brushIds = brushIndexList.map(i => `brush-${i}`); 

    // Initialize a collection of ids for the brush clips 
    this.state.clipIds = this.state.brushIds.map(id => `${id}-clip`); 

    // Create numBrushes + 1 lock ids 
    this.state.brushLockIds = _.range(0, this.state.numBrushes + 1).map(i => `lock-${i}`); 

    // Set the initial locked state for all locks to false 
    this.state.brushLocks = this.state.brushLockIds.map(i => false); 

    // Brush height - takes up 75% of vertical space in the container (not including MARGIN)
    this.state.brushHeight = height - 2 - LOCK_HEIGHT; 
    
  }

  /*
  externally: 
    * user can set width of focus region 
    * user can shift all brushes some duration to the left or right 
  */

  shiftBrushRange = (msecsDuration) => {
    /*
    Shift all unlocked brushes in a particular direction 
    */
    let d0 = this.props.timeDomains[0][0];              // date pre-shift
    let d1 = new Date(d0.valueOf() + msecsDuration);    // date post-shift
    let [p0,p1] = [d0,d1].map(this.props.controlScale); // pixel locations of pre and post shift dates 
    let shift = p0 - p1; 
    let currentSelections           = this.getBrushRanges(); 
    let previousSelections          = currentSelections.slice();
    let newSelections               = currentSelections.slice(); 
    let targetBrushIndex            = 1; 
    newSelections[targetBrushIndex] = previousSelections[targetBrushIndex].map(v => v + shift); 
    newSelections                   = this.computeAction(targetBrushIndex, newSelections, previousSelections); 
    this.updateAll(newSelections); 

  }

  lockBounds = () => {
    let leftLockId = this.state.brushLockIds[0]; 
    let rightLockId = this.state.brushLockIds[this.state.brushLockIds.length-1];
    this.lockClick(leftLockId); 
    this.lockClick(rightLockId);
  }

  setFocusBrushRange = (msecsDuration) => {
    /*
    Unlock boundaries and set focus width to some specified duration 
    */ 

    let isLocked = this.state.brushLocks[0]; 
    if (isLocked) {
      this.lockBounds(); 
    }

    let currentSelections = this.getBrushRanges();
    let focusR = currentSelections[1];  
    let [focusS, focusE] = focusR; 
    let focusMiddle = (focusE + focusS) / 2; 
    let sDate = this.props.timeDomains[0][0]; 
    let eDate = new Date(sDate.valueOf() + msecsDuration); 
    let [s, e] = [sDate, eDate].map(this.props.controlScale); 
    let newWidth = e - s; 
    let newS = focusMiddle - newWidth/2; 
    let newE = focusMiddle + newWidth/2; 
    let lShift = newS - focusS; 
    let rShift = newE - focusE;
    let lR = currentSelections[0].map(v => v + lShift); 
    let cR = [newS, newE]; 
    let rR = currentSelections[2].map(v => v + rShift); 
    
    this.updateAll([lR, cR, rR]); 
    
  }

  ingestProposal = (proposal) => {

    let { shift, dl, dr, index, id } = proposal; 
    let currentSelections = this.getBrushRanges(); 
    let previousSelections1, previousSelections2, 
        newSelections1, newSelections2, 
        newSelections; 

    switch (proposal.type) {
      case 'pan': 
        // translate 
        previousSelections1 = currentSelections.slice(); 
        newSelections1 = previousSelections1.slice(); 
        newSelections1[index] = previousSelections1[index].map(v => v + shift); 

        newSelections = this.computeAction(index, newSelections1, previousSelections1); 
        break; 
      case 'zoom': 
        // grow/shrink left 
        previousSelections1 = currentSelections.slice(); 
        newSelections1 = currentSelections.slice(); 
        newSelections1[index] = [previousSelections1[index][0] + dl, 
                                 previousSelections1[index][1]]; 
        
        // grow/shrink right 
        previousSelections2 = this.computeAction(index, newSelections1, previousSelections1); 
        newSelections2 = previousSelections2.slice(); 
        newSelections2[index] = [previousSelections2[index][0], 
                                 previousSelections2[index][1] + dr]; 

        newSelections = this.computeAction(index, newSelections2, previousSelections2);
        break; 
    }

    this.updateAll(newSelections); 

  }

  shouldComponentUpdate(nextProps, nextState) {

    // If container was resized, we need to resize the control axis and brushes 
    let resized = nextProps.width !== this.props.width && nextProps.width > 0; 
    let timeDomainsChanged = !_.isEqual(this.props.timeDomains, nextProps.timeDomains); 

    if (resized || timeDomainsChanged) {

      let { containerPadding, width } = nextProps; 
      let { timelineScale, timelineAxis } = nextState; 

      // Update the control axis 
      select('#axis-svg').attr('width', width); 
      timelineScale.range([containerPadding, width-containerPadding]);
      selectAll('.control-axis').call(timelineAxis); 

      // Update width of brush contianer 
      select('#brush-svg').attr('width', width-containerPadding*2); 
      
      // Pixel ranges for each brush 
      let updateTimeDomains = !timeDomainsChanged; 
      this.updateAll(nextProps.timeDomains.map(domain => domain.map(nextProps.controlScale)), updateTimeDomains); 

    }

    // D3 performs all other updates 
    return false;

  }

  componentDidMount() {
    // Code to create the d3 element, using the root container 
    let { 

      width, 
      height, 
      focusColor, 
      contextColor, 
      containerPadding, 
      lockActiveColor, 
      lockInactiveColor, 
      lockOutlineColor, 
      handleOutlineColor, 
      brushOutlineColor, 
      lockBounds
    
    } = this.props; 
    
    let root = select(this.ROOT); 
    
    // Create the svg container for the brushes
    let svg = root.append('svg')
                  .attr('id', 'brush-svg')
                  .attr('width', width-containerPadding*2)
                  .attr('height', height)

    // append dom node for capturing external proposals for shifts 
    let n = root.append("div").attr("id", 'external-proposal')
    n.on('click.setFocusBrushRange', this.setFocusBrushRange); 
    n.on('click.lockBounds', this.lockBounds);
    n.on('click.shiftBrushRange', this.shiftBrushRange);
    n.on('zoom.trackZoom', this.ingestProposal); 

    // Pixel ranges for each brush 
    let brushRanges = this.props.timeDomains.map(domain => domain.map(this.props.controlScale)); 

    // Create a clipping path for each brush  
    for (let i = 0; i < this.state.numBrushes; i++) {

      let clipId = this.state.clipIds[i]; 
      let brushSelection = brushRanges[i]; 

      svg.append('clipPath')
          .attr('id', clipId)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', tupdif(brushSelection))
            .attr('height', this.state.brushHeight)
            .attr('transform', `translate(${brushSelection[0]}, 0)`);

    }

    this.lockClick = (lockId) => {

        // Determine the lock index of the clicked lock 
        let lockIndex = this.state.brushLockIds.indexOf(lockId); 
        assert(lockIndex >= 0, 'lock doesnt exist'); 

        // Toggle the lock state
        let { brushLocks } = this.state;
        brushLocks[lockIndex] = !brushLocks[lockIndex];
        this.setState({ brushLocks }); 
        
        // Apply an animation to the lock to indicate the change 
        select(`#${lockId}`)
          .transition(transition().duration(300).ease(easeLinear))
          .attr('fill', brushLocks[lockIndex] ? lockActiveColor : lockInactiveColor); 
    }

    let addLock = (x, y, lockId) => {
      // Add a lock object at the given x,y position extending downwards
      svg.append('g')
            .append('rect')
            .attr('id', lockId)
            .attr('x', 0)
            .attr('y', y)
            .attr('stroke', lockOutlineColor)
            .attr('width', LOCK_WIDTH)
            .attr('height', LOCK_HEIGHT)
            .attr('transform', `translate(${x - LOCK_WIDTH / 2},0)`)
            .attr('fill', lockInactiveColor)
            .attr('rx', LOCK_HEIGHT / 4)
            .style("cursor", "pointer")
            .on('click', _.partial(this.lockClick, lockId)); 
            
    }

    // Creating a locking mechanism for every bi-directional handle 
    let dy = 1; 
    let lockTopY = this.state.brushHeight + dy; // locks are placed right below bottom of brush 
    for (let i = 0, li = 0; i < this.state.numBrushes; i++) {
      let brushSelection = brushRanges[i]; 
      let isFirst = i === 0; 
      if (isFirst) {
        // Add a lock to the beginning and end of the current brush 
        addLock(brushSelection[0], lockTopY, this.state.brushLockIds[li++]); 
        addLock(brushSelection[1], lockTopY, this.state.brushLockIds[li++]); 
      }
      else {
        // Add a lock to the end of the current brush 
        addLock(brushSelection[1], lockTopY, this.state.brushLockIds[li++]);  
      }
    }

    // check if outer bounds are initially locked 
    if (lockBounds) {
      let leftLockId = this.state.brushLockIds[0]; 
      let rightLockId = this.state.brushLockIds[this.state.brushLockIds.length-1]; 
      this.lockClick(leftLockId); 
      this.lockClick(rightLockId); 
    }

    // Create brushes 
    for (let i = 0; i < this.state.numBrushes; i++) {

      let brushFn = this.state.brushes[i]; 
      let brushId = this.state.brushIds[i]; 
      let clipId = this.state.clipIds[i]; 
      let brushSelection = brushRanges[i]; 
      let isFocus = i === parseInt(this.state.numBrushes / 2); 

      // Set the width ; height of the brush, height is retained when future transforms (resize / translate) are applied 
      brushFn.extent([[-10000, MARGIN.top], 
                      [10000, this.state.brushHeight]]); 

      // Add a brush to the svg 
      let userBrushed = _.partial(this.userBrushed, i)
      let brushG = svg.append("g")
                      .attr("id", brushId)
                      .attr('class', 'brush')
                      .attr('clipPath', `url(#${clipId})`)
                      .call(brushFn.on("brush", userBrushed))
                      .call(brushFn.move, brushSelection); 

      // Removes white stroke outline from brush. This looks bad if the user uses a custom style 
      // and the background color clashes with the white 
      brushG.selectAll('rect').attr('stroke', 'none'); 

      // Removes pointer events on overlay which takes up 100% of space in svg container 
      // By doing this, we only capture mouse events that occur over the selection region 
      // of the brush 
      brushG
        .select("rect.overlay")
        .style("pointer-events", "none"); 

      // Styling the brush selection 
      brushG
        .select("rect.selection")
        .attr('stroke', brushOutlineColor)
        .style("fill", isFocus ? focusColor : contextColor); 

      // Append custom handles to brush
      brushG.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter()
              .append("g")
              .attr('clipPath', `url(#${clipId})`)
                .append("rect")
                .attr('clipPath', `url(#${clipId})`)
                .attr('stroke', handleOutlineColor)
                .attr('x', 0)
                .attr('y', this.state.brushHeight / 2 - HANDLE_HEIGHT / 2)
                .attr('width', HANDLE_WIDTH)
                .attr('height', HANDLE_HEIGHT)
                .attr('transform', (d) => (d.type === 'w') ? `translate(${brushSelection[0]},0)` : 
                                                             `translate(${brushSelection[1] - HANDLE_WIDTH},0)`)
                .attr('rx', 3)
                .attr("class", (d) => `handle--custom ${d.type === 'w' ? 'handle-left' : 'handle-right'}`)
                .attr("fill", "#009688")
                .attr("fill-opacity", 0.8)
                .style("cursor", "ew-resize");

      // Disable existing brushes. Pointer events only active on custom brushes 
      brushG.select('.handle--e').style('pointer-events', 'none')
      brushG.select('.handle--w').style('pointer-events', 'none')

    }

    this.appendTimeline(); 

  }

  appendTimeline = () => {

    let root = select(this.ROOT); 
    let { controlScale, containerPadding, height, width, tickInterval } = this.props; 
    let { timelineScale, timelineAxis } = this.state; 

    let [cr0, cr1] = controlScale.range(); 
    timelineScale.domain(controlScale.domain())
                 .range([cr0 + containerPadding, cr1 - containerPadding]); 

    let axisSvg = root.append('svg')
                        .attr('id', 'axis-svg')
                        .attr('height', height)
                        .attr('width', width)
                        .attr('pointer-events', 'none')
                        .style('position', 'absolute') 
                        .style('top', containerPadding)
                        .style('left', 0)
                        .style('backgroundColor', 'rgba(0,0,0,0)');

    // Create a timeline 
    let axisGenerator = timelineAxis.scale(timelineScale).ticks(tickInterval); 

    axisSvg .append("g")
            .attr('class', 'control-axis')
            .call(axisGenerator) 
              .selectAll('text')
              .classed('pplot-control-timeline-text', true);

  }

  _updateBrushSelections = (newSelections) => {
    for (let i = 0; i < this.state.numBrushes; i++) {
        select(`#${this.state.brushIds[i]}`)
          .call(this.state.brushes[i].move, newSelections[i]); 
    }
  }

  _updateBrushExtras(newSelections) {

    // update left handles 
    let leftHandles = selectAll(".handle-left"); 
    let leftNodes = leftHandles.nodes(); 
    _.sortBy(leftNodes.map(node => parseInt(node.attributes.nodeValue))
                      .map((pos,hi) => ({ pos, hi })), 
             obj => obj.pos)
    .map(({ hi }) => hi)
    .map((hi, bi) => select(leftNodes[hi])
                       .attr('transform', `translate(${newSelections[bi][0]},0)`)); 

    // update right handles 
    let rightHandles = selectAll(".handle-right"); 
    let rightNodes = rightHandles.nodes(); 
    _.sortBy(rightNodes.map(node => parseInt(node.attributes.nodeValue))
                        .map((pos,hi) => ({ pos, hi })), 
             obj => obj.pos)
    .map(({ hi }) => hi)
    .map((hi, bi) => select(rightNodes[hi])
                       .attr('transform', `translate(${newSelections[bi][1] - HANDLE_WIDTH}, 0)`)); 

    // update clip positions 
    _.range(0, this.state.numBrushes).map(i => 
      select(`#${this.state.clipIds[i]} > rect`)
        .attr('transform', `translate(${parseInt(newSelections[i][0])}, 0)`)
        .attr('width', tupdif(newSelections[i]))
    )

    // update lock positions
    for (let i = 0; i < this.state.numBrushes; i++) {
      if (i === 0) {
        select(`#${this.state.brushLockIds[i]}`).attr('transform', `translate(${newSelections[i][0] - LOCK_WIDTH / 2},0)`);  
        select(`#${this.state.brushLockIds[i+1]}`).attr('transform', `translate(${newSelections[i][1] - LOCK_WIDTH / 2},0)`);
      } else {
        select(`#${this.state.brushLockIds[i+1]}`).attr('transform', `translate(${newSelections[i][1] - LOCK_WIDTH / 2},0)`);
      }
    }
    
  }

  getLockBounds(brushIndex) {

    // Determine the closest brush to the left of the current brush that is either left or right locked
    // this can possibly be the current brush 
    let leftLockedBrushIndex = -1; 
    for (let i = brushIndex - 1; i >= 0; i--) {
      let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(i); 
      if (leftHandleLocked || rightHandleLocked) {
        leftLockedBrushIndex = i; 
        break; 
      }
    }

    // Determine the closest brush to the right of the current brush that is either left or right locked
    // this can possibly be the current brush 
    let rightLockedBrushIndex = -1; 
    for (let i = brushIndex + 1; i < this.state.numBrushes; i++) {
      let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(i); 
      if (leftHandleLocked || rightHandleLocked) {
        rightLockedBrushIndex = i; 
        break; 
      }
    }


    return [leftLockedBrushIndex, rightLockedBrushIndex]; 
  }

  computeActionProperties = (index, currentSelections=null, previousSelections=null) => {
    // Compute a set of properties related to the current action 


    let round2 = (num) => Number(num.toFixed(2)); // round to 2 decimal places 
    let round1 = (num) => Number(num.toFixed(1)); 
    let round = (num) => Number(num.toFixed(0)); 

    currentSelections = currentSelections === null ? this.getBrushRanges() : currentSelections.slice(); 
    previousSelections = previousSelections === null ? this.state.brushRanges.slice() : previousSelections.slice(); 

    let isFocus = index === this.state.focusIndex;  
    let preS = previousSelections[index].map(round2); 
    let preW = tupdif(preS); 
    let curS = currentSelections[index].map(round2); 
    if (preS[0] === curS[0] && preS[1] === curS[1]) {
      // edge case where no movement occurred 
      return { 'noChange': true, previousSelections }; 
    }
    let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(index); 
    let isLocked = leftHandleLocked || rightHandleLocked; 
    let leftIndexRange = [0, index];
    let rightIndexRange = [Math.min(this.state.numBrushes, index + 1), this.state.numBrushes]; 
    let minWidth = this.state.focusIndex === index ? MIN_FOCUS_WIDTH : MIN_CONTEXT_WIDTH; 
    let curWidth = curS[1] - curS[0]; 
    let tooSmall = curWidth < minWidth;
    let brushLockBounds = this.getLockBounds(index);
    let [leftLockIndex, rightLockIndex] = brushLockBounds; 
    let lockedToLeft = brushLockBounds[0] !== -1; 
    let lockedToRight = brushLockBounds[1] !== -1; 
    let leftLockBoundS = lockedToLeft ? currentSelections[leftLockIndex] : null; 
    let rightLockBoundS = lockedToRight ? currentSelections[rightLockIndex] : null; 
    let sameWidth = round(preW) === round(curWidth); 
    let action = computeActionFromSelectionTransition(preS, curS); 
    let isTranslate = action >= 4; 
    let leftOverlappedRight = preS[1] === curS[0] && !sameWidth && !isTranslate; 
    let rightOverlappedLeft = preS[0] === curS[1] && !sameWidth && !isTranslate; 
    let overlapped = leftOverlappedRight || rightOverlappedLeft; 
    let isFirst = index === 0; 
    let isLast = index === numBrushes - 1; 
    let shiftSet = []; 
    let { numBrushes } = this.state; 

    if (action === null) {
      debugger;  
    }

    assert(action !== null, 'invalid brush action');
    let properties = { 
      isFocus,
      action, 
      currentSelections, 
      previousSelections, 
      preS, 
      preW, 
      curS, 
      numBrushes, 
      overlapped, 
      leftHandleLocked, 
      rightHandleLocked, 
      isLocked, 
      leftIndexRange, 
      rightIndexRange, 
      minWidth, 
      curWidth, 
      tooSmall,
      brushLockBounds, 
      lockedToLeft, 
      lockedToRight, 
      leftLockIndex, 
      rightLockIndex, 
      leftLockBoundS, 
      rightLockBoundS, 
      leftOverlappedRight, 
      rightOverlappedLeft, 
      shiftSet, 
      isFirst, 
      isLast
    }; 

    return properties; 
  }

  isBrushLeftLocked = (brushIndex) => this.state.brushLocks[brushIndex] 

  isBrushRightLocked = (brushIndex) => this.state.brushLocks[brushIndex+1]

  isBrushLocked = (brushIndex) => [this.isBrushLeftLocked(brushIndex), this.isBrushRightLocked(brushIndex)]

  getBrushRanges = () => (
    // Returns an array of two element lists, each representing the current selected pixel 
    // region of all of the brushes 
    this.state.brushIds
        .map(id => select(`#${id}`).node())
        .map(brushSelection)
  )

  computeAndPerformAction = (index, currentSelections) => this.updateAll(this.computeAction(index, currentSelections))

  userBrushed = (index) => (this.isUserGeneratedBrushEvent(index) && this.computeAndPerformAction(index))

  isUserGeneratedBrushEvent = (index) => !(
    // Ensure the current event was a user brush interaction 
    // We do not perform updates on zooms of via calls to brush.move 
    (!select(`#${this.state.brushIds[index]}`).node()) || 
    (!d3event.sourceEvent) ||
    (d3event.sourceEvent && d3event.sourceEvent.type === 'brush') || 
    (d3event.sourceEvent && d3event.sourceEvent.type === 'zoom')
  )

  computeAction(index, currentSelections=null, previousSelections=null) {

      let actionProperties = this.computeActionProperties(index, currentSelections, previousSelections); 
      let { noChange } = actionProperties; 
      if (noChange) {
        return actionProperties.previousSelections; 
      } 
      let newSelections; 
      if (actionProperties.overlapped) {
        newSelections = actionProperties.previousSelections; 
      } else {
        let actionExecutor = functionFromAction(actionProperties.action);
        let res = actionExecutor(index, actionProperties);  
        newSelections = res.currentSelections; 
        for (let shiftObj of res.shiftSet) {
          let { shift, shiftIndices } = shiftObj; 
          newSelections = performShifts(newSelections, shiftIndices, shift); 
        }
      }

      return newSelections
  }

  updateAll = (newSelections, updateTimeDomains=true) => {
    this._updateBrushSelections(newSelections); 
    this._updateBrushExtras(newSelections);
    this.setState({ brushRanges: newSelections }); 
    if (updateTimeDomains) {
      let newTimeDomains = newSelections.map(s => s.map(this.props.controlScale.invert).map(t => new Date(t))); 
      this.props.ACTION_CHANGE_timeDomains(newTimeDomains); 
    }
  }

  render() {  
    let { height, containerPadding } = this.props; 
    const containerStyle = {
      display: 'block', 
      position: 'relative', 
      paddingLeft: containerPadding, 
      paddingRight: containerPadding, 
      paddingTop: containerPadding, 
      boxSizing: 'content-box', 
      height: height
    }
    return <div style={containerStyle} ref={ref => this.ROOT = ref}/>
  }

}

const mapStateToProps = ({ 
                          timeDomains, 
                          focusColor, 
                          contextColor, 
                          containerPadding, 
                          proposal, 
                          tickInterval, 
                          lockActiveColor, 
                          lockInactiveColor, 
                          lockOutlineColor, 
                          handleOutlineColor, 
                          brushOutlineColor, 
                          controlScale,
                          baseWidth,
                          controlTimelineHeight, 
                          lockBounds
                        }) => 
                        ({ 
                          timeDomains, 
                          focusColor, 
                          contextColor, 
                          containerPadding, 
                          proposal, 
                          tickInterval, 
                          lockActiveColor, 
                          lockInactiveColor,
                          lockOutlineColor, 
                          handleOutlineColor, 
                          brushOutlineColor, 
                          controlScale, 
                          width: baseWidth, 
                          height: controlTimelineHeight, 
                          lockBounds 
                        });
                        
const mapDispatchToProps = dispatch => ({

  ACTION_CHANGE_timeDomains: (timeDomains) => 
    dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 

}); 

export default connect(mapStateToProps, mapDispatchToProps, null, { context: PeripheryPlotContext })(TimelineControl);
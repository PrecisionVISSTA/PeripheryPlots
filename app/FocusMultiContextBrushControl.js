import React from "react";
import * as d3 from 'd3';
import { event as d3event } from 'd3';
import _ from "lodash"; 
import { connect } from "react-redux"; 
import { assert } from "chai"; 

import { getEquilateralTriangleFromCentroid } from "./util/util"; 

/*
BRUSH TODOS 

* Instead of reverting to previous state in cases where we overrun container bounds on 
left or right side, compute a shift and apply it 
* Remove resize listeners from all places except resize handles 
* Fix issues with overlapping brush handles during constant brush gesture
* Add locks to the bottom of all brush handles 
* Make brush resize handles rectangular with border radius 
* Update canMove function to consider lock state of brushes 
*/

const LOCK_WIDTH = 10; 
const LOCK_HEIGHT = 10; 
const LOCK_ACTIVE_COLOR = "grey"; 
const LOCK_INACTIVE_COLOR = "black"; 
const CONTEXT_SELECTION_COLOR = "#bfbfbf"; 
const MIN_CONTEXT_WIDTH = 5; //minimum width of the context brushes in pixels
const MIN_FOCUS_WIDTH = 5; //minimum width of the focus brush in pixels

const tupdif = tup => tup[1] - tup[0]; 

let brushState = {
  brushes: [], //collection of d3 brush objects 
  brushRanges: [], // The collection of most recent brush selections
  brushIds: [], // Collection of brush ids for selection 
  brushLocks: [], // Collection of booleans to indicate whether or not a brush is locked 
  brushLockIds: [], // Collection of ids to reference brush lock ids 
  numBrushes: 0, // The total number of brushes 
  brushHeight: 0, // The vertical height of the brush 
  containerScale: d3.scaleLinear() // Maps time points to a corresponding x coordinate within the container 
};

class FocusMultiContextBrushControl extends React.Component {



  constructor(props) {
    super(props); 

    let { width, height, timeDomains, timeExtentDomain } = this.props; 

    brushState.containerScale.domain(timeExtentDomain).range([0, width]); 

    // 1 focus + equal number of contexts on both sides 
    assert(timeDomains.length % 2 === 1);

    // Infer the number of brushes 
    brushState.numBrushes = timeDomains.length; 
    
    let brushIndexList = _.range(0, brushState.numBrushes); 

    // Initialize brush selection states 
    brushState.brushRanges = timeDomains.map(domain => domain.map(brushState.containerScale)); 

    // Initialize the brushes 
    brushState.brushes = brushIndexList.map(i => d3.brushX()); 

    // Initialize a collection of ids for the brushes 
    brushState.brushIds = brushIndexList.map(i => `brush-${i}`); 

    // Initialize a collection of ids for the brush clips 
    brushState.clipIds = brushState.brushIds.map(id => `${id}-clip`); 

    // Create numBrushes + 1 lock ids 
    brushState.brushLockIds = _.range(0, brushState.numBrushes + 1).map(i => `lock-${i}`); 

    // Set the initial locked state for all locks to false 
    brushState.brushLocks = brushState.brushLockIds.map(i => false); 

    // Brush height - takes up 80% of vertical space in the container 
    brushState.brushHeight = height * .8; 
    
  }

  shouldComponentUpdate() {
    // Let d3 perform updates 
    return false; 
  }

  componentDidMount() {
    // Code to create the d3 element, using the root container 
    let { width, height } = this.props; 
    let root = d3.select(this.ROOT); 
    
    // Create the svg container for the brushes
    let svg = root.append('svg')
                  .attr('width', width) 
                  .attr('height', height);

    // Create a clipping path for each brush  
    for (let i = 0; i < brushState.numBrushes; i++) {

      let clipId = brushState.clipIds[i]; 
      let brushSelection = brushState.brushRanges[i]; 

      svg.append('clipPath')
          .attr('id', clipId)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', tupdif(brushSelection))
            .attr('height', brushState.brushHeight)
            // .attr('position', 'absolute')
            .attr('transform', `translate(${brushSelection[0]}, 0)`);

    }

    let addLock = (x, y, lockId) => {
      // Add a lock object at the given x,y position extending downwards
      svg.append('g')
            .append('rect')
            .attr('id', lockId)
            .attr('x', 0)
            .attr('y', y)
            .attr('width', LOCK_WIDTH)
            .attr('height', LOCK_HEIGHT)
            .attr('transform', `translate(${x - LOCK_WIDTH / 2},0)`)
            .attr('fill', LOCK_INACTIVE_COLOR)
            .attr('rx', LOCK_HEIGHT / 4)
            .on('click', () => {
              // Determine the lock index of the clicked lock 
              let lockIndex = brushState.brushLockIds.indexOf(lockId); 
              assert(lockIndex >= 0); 

              // Toggle the lock state
              brushState.brushLocks[lockIndex] = !brushState.brushLocks[lockIndex];
              
              // Apply an animation to the lock to indicate the change 
              d3.select(`#${lockId}`)
                .transition(d3.transition().duration(300).ease(d3.easeLinear))
                .attr('fill', brushState.brushLocks[lockIndex] ? LOCK_ACTIVE_COLOR : LOCK_INACTIVE_COLOR); 
            }); 
    }

    // Creating a locking mechanism for every bi-directional handle 
    let dy = 1; 
    let lockTopY = brushState.brushHeight + dy; // locks are placed right below bottom of brush 
    for (let i = 0, li = 0; i < brushState.numBrushes; i++) {
      let brushSelection = brushState.brushRanges[i]; 
      let isFirst = i === 0; 
      if (isFirst) {
        // Add a lock to the beginning and end of the current brush 
        addLock(brushSelection[0], lockTopY, brushState.brushLockIds[li++]); 
        addLock(brushSelection[1], lockTopY, brushState.brushLockIds[li++]); 
      }
      else {
        // Add a lock to the end of the current brush 
        addLock(brushSelection[1], lockTopY, brushState.brushLockIds[li++]);  
      }
    }

    // Create brushes 
    for (let i = 0; i < brushState.numBrushes; i++) {

      let brushFn = brushState.brushes[i]; 
      let brushId = brushState.brushIds[i]; 
      let clipId = brushState.clipIds[i]; 
      let brushSelection = brushState.brushRanges[i]; 
      let isFocus = i === parseInt(brushState.numBrushes / 2); 

      // Set the width ; height of the brush, height is retained when future transforms (resize / translate) are applied 
      brushFn.extent([[0, 0], [width, brushState.brushHeight]]); 

      // Add a brush to the svg 
      let brushG = svg.append("g")
                      .attr("id", brushId)
                      .attr('class', 'brush')
                      .call(brushFn.on("brush", _.partial(this.brushed, isFocus, i)))
                      .call(brushFn.move, brushSelection); 

      // Removes pointer events on overlay which takes up 100% of space in svg container 
      // By doing this, we only capture mouse events that occur over the selection region 
      // of the brush 
      brushG
        .select("rect.overlay")
        .style("pointer-events", "none"); 

      if (!isFocus) {
        // Apply styling to the context brush region
        brushG
          .select("rect.selection")
          .style("fill", CONTEXT_SELECTION_COLOR); 
      } else {
        // Apply styling to the focus brush region
      }

      // Append custom handles to brush
      brushG.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter()
              .append("g")
              .attr('clipPath', `url(#${clipId})`)
                .append("circle")
                .attr('cx', 0)
                .attr('cy', brushState.brushHeight/2)
                .attr('position', 'absolute')
                .attr('r', 10)
                .attr('transform', (d) => (d.type === 'w') ? `translate(${brushSelection[0]},0)` : 
                                                             `translate(${brushSelection[1]},0)`)
                .attr("class", (d) => `handle--custom ${d.type === 'w' ? 'handle-left' : 'handle-right'}`)
                .attr("fill", "#009688")
                .attr("fill-opacity", 0.8)
                .attr("cursor", "ew-resize"); 
    }

  }

  updateBrushHandles(brushSelections) {

    // Update left handles 
    let leftHandles = d3.selectAll(".handle-left"); 
    let leftNodes = leftHandles.nodes(); 
    _.sortBy(leftNodes.map(node => parseInt(node.attributes.nodeValue))
                      .map((pos,hi) => ({ pos, hi })), 
             obj => obj.pos)
    .map(({ hi }) => hi)
    .map((hi, bi) => d3.select(leftNodes[hi])
                       .attr('transform', `translate(${brushSelections[bi][0]},0)`)); 

    // Update right handles 
    let rightHandles = d3.selectAll(".handle-right"); 
    let rightNodes = rightHandles.nodes(); 
    _.sortBy(rightNodes.map(node => parseInt(node.attributes.nodeValue))
                        .map((pos,hi) => ({ pos, hi })), 
             obj => obj.pos)
    .map(({ hi }) => hi)
    .map((hi, bi) => d3.select(rightNodes[hi])
                       .attr('transform', `translate(${brushSelections[bi][1]}, 0)`)); 

    // Update clip positions 
    for (let i = 0; i < brushState.numBrushes; i++) {
      d3.select(`#${brushState.clipIds[i]} > rect`)
        .attr('transform', `translate(${parseInt(brushSelections[i][0])}, 0)`)
        .attr('width', tupdif(brushSelections[i]))
    }     

    // Update lock positions
    for (let i = 0; i < brushState.numBrushes; i++) {
      if (i === 0) {
        d3.select(`#${brushState.brushLockIds[i]}`).attr('transform', `translate(${brushState.brushRanges[i][0] - LOCK_WIDTH / 2},0)`);  
        d3.select(`#${brushState.brushLockIds[i+1]}`).attr('transform', `translate(${brushState.brushRanges[i][1] - LOCK_WIDTH / 2},0)`);
      } else {
        d3.select(`#${brushState.brushLockIds[i+1]}`).attr('transform', `translate(${brushState.brushRanges[i][1] - LOCK_WIDTH / 2},0)`);
      }
    }
    
  }

  isBrushLocked(brushIndex) {
    // Returns an array of the form [boolean, boolean] which indicates 
    // whether or not the left and right handles of the current brush are locked 
    return [brushState.brushLocks[brushIndex], 
            brushState.brushLocks[brushIndex+1]]
  }

  getBrushRanges() {
    // Returns an array of two element lists, each representing the current selected pixel 
    // region of all of the brushes 
    return brushState.brushIds
                .map(id => d3.select(`#${id}`).node())
                .map(d3.brushSelection); 
  }

  brushesCanMove(selections, shift) {
    /*
    Test if all brushes in a list can be moved to the 'shift' units 
    and stay within the bounds of the container. 
    'shift' is a signed value indicating movement to the left (negative)
    or to the right (positive)
    */
    let [smin, smax] = [0, this.props.width]; 
    for (let i = 0; i < selections.length; i++) {
      let [s0,s1] = selections[i]; 
      let canMove = s0 + shift >= smin && s1 + shift < smax;  
      if (!canMove) {
        return false; 
      }
    }
    return true; 
  }

  brushed = (isFocus, index) => {
    /*
    Brush behavior: Grow / Shrink to right / left
    */ 

    // Ensure the node exists in the DOM and that the event was triggered by user 
    // interaction (not programatically via a call to brush.move)
    if (!d3.select(`#${brushState.brushIds[index]}`).node() || 
        !d3event.sourceEvent ||
        (d3event.sourceEvent && d3event.sourceEvent.type === 'brush')) 
        return; 

    // Get the current and previous selections for all brushes 
    let brushRanges = this.getBrushRanges(); 
    let previousBrushSelections = brushState.brushRanges; 

    // Get the current and previous selections for the event target brush 
    let preS = previousBrushSelections[index]; 
    let curS = brushRanges[index]; 

    // Get the lock state 
    let [leftLocked, rightLocked] = this.isBrushLocked(index); 

    let brushActions = {

      RESIZE_SHRINK_LEFT: 0, 
      RESIZE_SHRINK_RIGHT: 1, 
      RESIZE_GROW_LEFT: 2, 
      RESIZE_GROW_RIGHT: 3, 
      TRANSLATE_LEFT: 4, 
      TRANSLATE_RIGHT: 5, 

      // If not resize, translate occurred 
      isResize: function(brushAction) {
         return [this.RESIZE_SHRINK_LEFT, 
                 this.RESIZE_SHRINK_RIGHT, 
                 this.RESIZE_GROW_LEFT, 
                 this.RESIZE_GROW_RIGHT].includes(brushAction); 
      }, 

      // If left handle does not change, right handle changed 
      leftHandleChanged: function(brushAction) {
        return [this.RESIZE_SHRINK_LEFT, 
                this.RESIZE_GROW_LEFT, 
                this.TRANSLATE_LEFT].includes(brushAction);
      }

    }; 

    // Determine which of the possible brush actions occurred based on current and previous state 
    let currentAction = (preS[0] < curS[0] && preS[1] === curS[1]) ? brushActions.RESIZE_SHRINK_LEFT : 
                        (preS[0] > curS[0] && preS[1] === curS[1]) ? brushActions.RESIZE_GROW_LEFT :
                        (preS[1] > curS[1] && preS[0] === curS[0]) ? brushActions.RESIZE_SHRINK_RIGHT : 
                        (preS[1] < curS[1] && preS[0] === curS[0]) ? brushActions.RESIZE_GROW_RIGHT :           
                        (preS[0] > curS[0] && preS[1] > curS[1]) ? brushActions.TRANSLATE_LEFT : 
                        (preS[0] < curS[0] && preS[1] < curS[1]) ? brushActions.TRANSLATE_RIGHT : 
                        null; 

    assert(currentAction !== null); 

    let newSelections = brushRanges.slice(); 
    let leftIndexRange = [0, index];
    let rightIndexRange = [Math.min(brushState.numBrushes, index + 1), brushState.numBrushes]; 
    let leftBrushes = brushRanges.slice(...leftIndexRange); 
    let rightBrushes = brushRanges.slice(...rightIndexRange); 
    let minWidth = isFocus ? MIN_FOCUS_WIDTH : MIN_CONTEXT_WIDTH; 
    let curWidth = tupdif(curS); 
    let shift = 0; 
    let proposedShift; 
    let didOverlap; 
    let shiftIndices = null; 

    switch(currentAction) {
      case brushActions.RESIZE_SHRINK_LEFT: 
        if (curWidth < minWidth || leftLocked) {
          newSelections[index] = preS; 
        } else {
          shift = curS[0] - preS[0]; 
          shiftIndices = _.range(...leftIndexRange); 
        }
        break; 
      case brushActions.RESIZE_SHRINK_RIGHT: 
        if (curWidth < minWidth || rightLocked) {
          newSelections[index] = preS; 
        } else {
          shift = curS[1] - preS[1]; 
          shiftIndices = _.range(...rightIndexRange); 
        }
        break; 
      case brushActions.RESIZE_GROW_LEFT: 
        proposedShift = curS[0] - preS[0];  
        didOverlap = curS[1] <= preS[0]; //right handle overlapped left handle 
        if (!leftLocked && !didOverlap && this.brushesCanMove(leftBrushes, proposedShift)) {
          shift = proposedShift; 
          shiftIndices = _.range(...leftIndexRange);
        } else {
          newSelections[index] = preS; 
        }
        break; 
      case brushActions.RESIZE_GROW_RIGHT:
        proposedShift = curS[1] - preS[1]; 
        didOverlap = curS[0] >= preS[1]; //left handle overlapped right handle 
        if (!rightLocked && !didOverlap && this.brushesCanMove(rightBrushes, proposedShift)) {
          shift = proposedShift; 
          shiftIndices = _.range(...rightIndexRange); 
        } else {
          newSelections[index] = preS; 
        }
        break; 
      case brushActions.TRANSLATE_LEFT: 
        proposedShift = curS[0] - preS[0]; 
        if ((!leftLocked && !rightLocked) && this.brushesCanMove(leftBrushes, proposedShift)) {
          shift = proposedShift; 
          shiftIndices = _.union(_.range(...leftIndexRange), 
                                 _.range(...rightIndexRange)); 
        } else {
          newSelections[index] = preS; 
        }
        break; 
      case brushActions.TRANSLATE_RIGHT:
        proposedShift = curS[0] - preS[0];  
        if ((!leftLocked && !rightLocked) && this.brushesCanMove(rightBrushes, proposedShift)) {
          shift = proposedShift; 
          shiftIndices = _.union(_.range(...leftIndexRange), 
                                 _.range(...rightIndexRange)); 
        } else {
          newSelections[index] = preS; 
        }
        break; 
      default: 
        // This will never happen as we already ensure (assert statement) the currentAction is a valid brushAction 
        assert(false, 'invalid brush action');  
    }

    // Perform shifts if necessary
    newSelections = shift !== 0 ? newSelections.map((s,i) => shiftIndices.includes(i) ? s.map(e => e + shift) : s) : 
                                  newSelections; 

    // Update brush positions if a change occurred 
    for (let i = 0; i < brushState.numBrushes; i++) {
      if (!_.isEqual(newSelections[i], brushRanges[i])) {
        d3.select(`#${brushState.brushIds[i]}`)
          .call(brushState.brushes[i].move, newSelections[i]); 
      }
    }

    brushState.brushRanges = newSelections;

    this.updateBrushHandles(newSelections); 

  }

  render() {  
    return <div id="ROOT" ref={ref => this.ROOT = ref} />
  }
}

const mapStateToProps = ({ timeDomains, timeExtentDomain }) => 
                        ({ timeDomains, timeExtentDomain }); 

export default connect(mapStateToProps, null)(FocusMultiContextBrushControl); 
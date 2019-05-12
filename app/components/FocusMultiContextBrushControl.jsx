import React from "react";
import * as d3 from 'd3';
import { event as d3event } from 'd3';
import _ from "lodash"; 
import { connect } from "react-redux"; 
import { assert } from "chai"; 

import { getEquilateralTriangleFromCentroid } from "../util/util"; 

/*
BRUSH TODOS 

*** handle brush overlap on resizing 

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
const HANDLE_WIDTH = 12; 
const HANDLE_HEIGHT = 12; 
const CONTEXT_SELECTION_COLOR = "#bfbfbf"; 
const MIN_CONTEXT_WIDTH = HANDLE_WIDTH * 2; 
const MIN_FOCUS_WIDTH = HANDLE_WIDTH * 2; 

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
              assert(lockIndex >= 0, 'lock doesnt exist'); 

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
      let brushed = _.partial(this.brushed, isFocus, i)
      let brushG = svg.append("g")
                      .attr("id", brushId)
                      .attr('class', 'brush')
                      .attr('clipPath', `url(#${clipId})`)
                      .call(brushFn.on("brush", brushed))
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
                .append("rect")
                .attr('clipPath', `url(#${clipId})`)
                .attr('x', 0)
                .attr('y', brushState.brushHeight/2 - HANDLE_HEIGHT / 2)
                .attr('width', HANDLE_WIDTH)
                .attr('height', HANDLE_HEIGHT)
                .attr('transform', (d) => (d.type === 'w') ? `translate(${brushSelection[0]},0)` : 
                                                             `translate(${brushSelection[1] - HANDLE_WIDTH},0)`)
                .attr('rx', 3)
                .attr("class", (d) => `handle--custom ${d.type === 'w' ? 'handle-left' : 'handle-right'}`)
                .attr("fill", "#009688")
                .attr("fill-opacity", 0.8)
                .attr("cursor", "ew-resize");
    }

  }

  updateBrushExtras(brushSelections) {

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
                       .attr('transform', `translate(${brushSelections[bi][1] - HANDLE_WIDTH}, 0)`)); 

    // Update clip positions 
    _.range(0, brushState.numBrushes).map(i => 
      d3.select(`#${brushState.clipIds[i]} > rect`)
        .attr('transform', `translate(${parseInt(brushSelections[i][0])}, 0)`)
        .attr('width', tupdif(brushSelections[i]))
    )

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

  isBrushLeftLocked(brushIndex) {
      // Returns true if the brush at brushIndex has its left handle locked 
    return brushState.brushLocks[brushIndex]; 
  }

  isBrushRightLocked(brushIndex) {
    // Returns true if the brush at brushIndex has its right handle locked 
    return brushState.brushLocks[brushIndex+1]; 
  }

  isBrushLocked(brushIndex) {
    // Returns an array of the form [boolean, boolean] which indicates 
    // whether or not the left and right handles of the current brush are locked 
    return [this.isBrushLeftLocked(brushIndex), 
            this.isBrushRightLocked(brushIndex)]; 
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
    for (let i = brushIndex + 1; i < brushState.numBrushes; i++) {
      let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(i); 
      if (leftHandleLocked || rightHandleLocked) {
        rightLockedBrushIndex = i; 
        break; 
      }
    }


    return [leftLockedBrushIndex, rightLockedBrushIndex]; 
  }

  getBrushRanges() {
    // Returns an array of two element lists, each representing the current selected pixel 
    // region of all of the brushes 
    return brushState.brushIds
                .map(id => d3.select(`#${id}`).node())
                .map(d3.brushSelection); 
  }

  selectionsCanShift(selections, shift) {
    /*
    Test if a collection of selections can be shifted 'shift' units and remain within the 
    bounds of the container. Returns true if selections is empty 
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
    let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(index); 
    let isLocked = leftHandleLocked || rightHandleLocked; 

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

    assert(currentAction !== null, 'invalid action'); 

    let newSelections = brushRanges.slice(); 
    let leftIndexRange = [0, index];
    let rightIndexRange = [Math.min(brushState.numBrushes, index + 1), brushState.numBrushes]; 
    let leftBrushSelections = brushRanges.slice(...leftIndexRange); 
    let rightBrushSelections = brushRanges.slice(...rightIndexRange); 
    let minWidth = isFocus ? MIN_FOCUS_WIDTH : MIN_CONTEXT_WIDTH; 
    let curWidth = tupdif(curS); 
    let tooSmall = curWidth < minWidth;
    let brushLockBounds = this.getLockBounds(index);
    let [leftLockIndex, rightLockIndex] = brushLockBounds; 
    let lockedToLeft = brushLockBounds[0] !== -1; 
    let lockedToRight = brushLockBounds[1] !== -1; 
    let leftLockBoundS = lockedToLeft ? newSelections[leftLockIndex] : null; 
    let rightLockBoundS = lockedToRight ? newSelections[rightLockIndex] : null; 
    let shift = 0; 
    let proposedShift; 
    let proposedWidth; 
    let canResizeLockedBrush; 
    let shiftIndices = null; 

      switch (currentAction) {
        case brushActions.RESIZE_SHRINK_LEFT: 
          if (leftHandleLocked) {
            newSelections[index] = preS;
          } else {
            if (tooSmall) {
              newSelections[index] = [preS[1] - minWidth, preS[1]];
              shift = newSelections[index][0] - preS[0];
            } else {
              shift = curS[0] - preS[0]; 
            }
            if (lockedToLeft) {
              newSelections[leftLockIndex] = [leftLockBoundS[0],
                                              leftLockBoundS[1] + shift]; 
              shiftIndices = _.range(leftIndexRange[0] + 1, leftIndexRange[1]); 
            } else {
              shiftIndices = _.range(...leftIndexRange); 
            }
          }
          break; 
        case brushActions.RESIZE_SHRINK_RIGHT: 
          if (rightHandleLocked) {
            newSelections[index] = preS;
          } else {
            if (tooSmall) {
              newSelections[index] = [preS[0], preS[0] + minWidth];
              shift = newSelections[index][1] - preS[1];   
            } else {
              shift = curS[1] - preS[1];  
            }
            if (lockedToRight) {
              newSelections[rightLockIndex] = [rightLockBoundS[0], 
                                               rightLockBoundS[1] + shift];
              shiftIndices = _.range(index + 1, rightLockIndex); 
            } else {
              shiftIndices = _.range(...rightIndexRange);
            }
          }
          break; 
        case brushActions.RESIZE_GROW_LEFT: 
          proposedShift = curS[0] - preS[0];  
          if (leftHandleLocked) {
            newSelections[index] = preS; 
          } else {
            if (lockedToLeft) {
              canResizeLockedBrush = (leftLockBoundS[1] + proposedShift) - leftLockBoundS[0] >= minWidth; 
              if (canResizeLockedBrush) {
                shift = proposedShift;
                newSelections[leftLockIndex] = [leftLockBoundS[0], 
                                                leftLockBoundS[1] + shift];
                shiftIndices = _.range(leftLockIndex + 1, index); 
              } else {
                newSelections[leftLockIndex] = [leftLockBoundS[0], 
                                                leftLockBoundS[0] + minWidth];
                newSelections[index] = preS; 
                shift = leftLockBoundS[1] - previousBrushSelections[leftLockIndex + 1][0]; 
                shiftIndices = _.range(leftLockIndex + 1, index + 1); 
              }
            } else {
              if (this.selectionsCanShift(leftBrushSelections, proposedShift)) {
                shift = proposedShift; 
                shiftIndices = _.range(...leftIndexRange);
              } else {
                shift = -leftBrushSelections[0][0]; 
                shiftIndices = _.range(0, index + 1); 
                newSelections[index] = preS; 
              }
            }
          }
          break; 
        case brushActions.RESIZE_GROW_RIGHT: 
          proposedShift = curS[1] - preS[1];  
          if (rightHandleLocked) {
            newSelections[index] = preS; 
          } else {
            if (lockedToRight) {
              canResizeLockedBound = rightLockBoundS[1] - (rightLockBoundS[0] + proposedShift) >= minWidth; 
              if (canResizeLockedBound) {
                shift = proposedShift;
                newSelections[rightLockIndex] = [rightLockBound[0] + shift, 
                                                 rightLockBound[1]]; 
                shiftIndices = _.range(index + 1, rightLockIndex); 
              } else {
                newSelections[rightLockIndex] = [rightLockBoundS[1] - minWidth, 
                                                 rightLockBound[1]]; 
                newSelections[index] = preS; 
                shift = rightLockBoundS[0] - newSelections[rightLockIndex-1][1]; 
                shiftIndices = _.range(index, rightLockIndex); 
              }
            } else {
              if (this.selectionsCanShift(rightBrushSelections, proposedShift)) {
                shift = proposedShift; 
                shiftIndices = _.range(...rightIndexRange);
              } else {
                shift = this.props.width - newSelections[newSelections.length - 1][1]; 
                shiftIndices = _.union([index],  _.range(...rightIndexRange));
                newSelections[index] = preS; 
              }
            }
          }
          break; 
        case brushActions.TRANSLATE_LEFT: 
          proposedShift = curS[0] - preS[0]; 
          if (isLocked) {
            newSelections[index] = preS; 
          } else if (lockedToLeft) {
            proposedWidth = (leftLockBoundS[1] + proposedShift) - leftLockBoundS[0]; 
            if (proposedWidth < minWidth) {
              newSelections[leftLockIndex] = [leftLockBoundS[0], 
                                              leftLockBoundS[0] + minWidth];
              newSelections[index] = preS; 
              shift = -(newSelections[leftLockIndex + 1][0] - newSelections[leftLockIndex][1]);
              shiftIndices = _.range(leftLockIndex + 1, brushState.numBrushes); 
            } else {
              newSelections[leftLockIndex] = [leftLockBoundS[0], 
                                              leftLockBoundS[1] + proposedShift];
              shift = proposedShift;  
              shiftIndices = _.range(leftLockIndex + 1, brushState.numBrushes).filter(i => i !== index); 
            }
          } else {
            if (this.selectionsCanShift(leftBrushSelections, proposedShift)) {
              shift = proposedShift; 
              if (lockedToRight) {
                shiftIndices =  _.union(_.range(...leftIndexRange), 
                                        _.range(rightIndexRange[0], rightLockIndex)); 
                newSelections[rightLockIndex] = [rightLockBoundS[0] + shift, 
                                                 rightLockBoundS[1]]; 
              } else {
                shiftIndices = _.union(_.range(...leftIndexRange), 
                                       _.range(...rightIndexRange)); 
              }
            } else {
              shift = -previousBrushSelections[0][0];
              newSelections[index] = preS; 
              if (lockedToRight) {
                shiftIndices =  _.union(_.range(...leftIndexRange), 
                                        [index], 
                                        _.range(rightIndexRange[0], rightLockIndex)); 
                newSelections[rightLockIndex] = [rightLockBoundS[0] + shift, 
                                                 rightLockBoundS[1]]; 
              } else {
                shiftIndices = _.union(_.range(...leftIndexRange), 
                                      [index], 
                                       _.range(...rightIndexRange)); 
              }
            }
          }
          break; 
        case brushActions.TRANSLATE_RIGHT:
          proposedShift = curS[0] - preS[0];  
          if (isLocked) {
            newSelections[index] = preS; 
          } else if (lockedToRight) {
            proposedWidth = rightLockBoundS[1] - (rightLockBoundS[0] + proposedShift); 
            if (proposedWidth < minWidth) {
              newSelections[rightLockIndex] = [rightLockBoundS[1] - minWidth, 
                                               rightLockBoundS[1]];
              newSelections[index] = preS; 
              shift = newSelections[rightLockIndex][0] - previousBrushSelections[rightLockIndex - 1][1]; 
              shiftIndices = _.range(0, rightLockIndex); 
            } else {
              newSelections[rightLockIndex] = [rightLockBoundS[0] + proposedShift, 
                                               rightLockBoundS[1]];
              shift = proposedShift;  
              shiftIndices = _.range(0, rightLockIndex).filter(i => i !== index); 
            }
          } else {
            if (this.selectionsCanShift(rightBrushSelections, proposedShift)) {
              shift = proposedShift; 
              if (lockedToLeft) {
                shiftIndices = _.union(_.range(leftLockIndex + 1, index), 
                                       _.range(...rightIndexRange));  
                newSelections[leftLockIndex] = [leftLockBoundS[0], 
                                                leftLockBoundS[1] + shift]
              } else {
                shiftIndices = _.union(_.range(...leftIndexRange), 
                                       _.range(...rightIndexRange)); 
              }
            } else {
              shift = this.props.width - previousBrushSelections[previousBrushSelections.length - 1][1];
              newSelections[index] = preS; 
              if (lockedToLeft) {
                shiftIndices = _.union(_.range(leftLockIndex + 1, index), 
                                       [index], 
                                       _.range(...rightIndexRange));
                newSelections[leftLockIndex] = [leftLockBoundS[0], 
                                                leftLockBoundS[1] + shift]; 
              } else {
                shiftIndices = _.union(_.range(...leftIndexRange), 
                                       [index], 
                                       _.range(...rightIndexRange)); 
              }
            }
          }
          break; 
      }

    // Perform shifts if necessary
    newSelections = shift !== 0 ? newSelections.map((s,i) => shiftIndices.includes(i) ? s.map(e => e + shift) : s) : 
                                  newSelections; 

    // Update brush positions if a change occurred since the previous brush event 
    for (let i = 0; i < brushState.numBrushes; i++) {
      if (!_.isEqual(newSelections[i], brushRanges[i])) {
        d3.select(`#${brushState.brushIds[i]}`)
          .call(brushState.brushes[i].move, newSelections[i]); 
      }
    }

    brushState.brushRanges = newSelections;

    this.updateBrushExtras(newSelections); 

  }

  render() {  
    return <div id="ROOT" ref={ref => this.ROOT = ref} />
  }
}

const mapStateToProps = ({ timeDomains, timeExtentDomain }) => 
                        ({ timeDomains, timeExtentDomain }); 

export default connect(mapStateToProps, null)(FocusMultiContextBrushControl); 
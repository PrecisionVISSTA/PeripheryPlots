"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PeripheryPlots;

var _react = _interopRequireDefault(require("react"));

var _PeripheryPlotsWrapperHOC = _interopRequireDefault(require("./Wrappers/PeripheryPlotsWrapperHOC"));

var _PeripheryPlotsContainerizedContent = _interopRequireDefault(require("./Wrappers/PeripheryPlotsContainerizedContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import getPeripheryPlotsDistributedComponents from "./Detached/configurePeripheryPlotsPieces"; 
// function DistributedContent(props) {
//     let { config } = props;  
//     let {
//         PeripheryPlotsTimeline, 
//         PeripheryPlotsAligner, 
//         PeripheryPlotsTrack
//     } = getPeripheryPlotsDistributedComponents(config); 
//     return (
//         <React.Fragment>
//             <div>
//                 <div>
//                     <PeripheryPlotsTimeline/>
//                 </div>
//             </div>
//             <div>
//                 <div>
//                     <p style={{ display: 'block' }}>distributed testing</p>
//                     <PeripheryPlotsAligner/>
//                 </div>
//             </div>
//             {config.trackwiseObservations.map((o, i) => 
//                 <div>
//                     <div>
//                         <PeripheryPlotsTrack i={i}/>
//                     </div>
//                 </div>
//             )}
//         </React.Fragment>
//     );
// }
// let PeripheryPlotsComponent = PeripheryPlotsWrapperHOC(DistributedContent, props.config); 
// return <PeripheryPlotsComponent/>; 
function PeripheryPlots(props) {
  var PeripheryPlotsComponent = (0, _PeripheryPlotsWrapperHOC["default"])(_PeripheryPlotsContainerizedContent["default"], props.config);
  return _react["default"].createElement(PeripheryPlotsComponent, null);
}

;
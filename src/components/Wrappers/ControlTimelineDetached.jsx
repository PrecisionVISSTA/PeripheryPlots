import { connect } from "react-redux"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import { getControlTimeline } from "./PeripheryPlotsPiecesConstructors"; 

const mapStateToProps = ({ 
    controlTimelineHeight, 
    baseWidth, 
    controlScale
}) => 
({
    controlTimelineHeight, 
    baseWidth, 
    controlScale
}); 

export default connect(mapStateToProps, null, null, { context: PeripheryPlotContext })(getControlTimeline); 


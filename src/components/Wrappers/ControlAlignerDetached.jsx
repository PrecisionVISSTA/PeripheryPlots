import { connect } from 'react-redux'; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import { getControlAligner } from "./PeripheryPlotsPiecesConstructors"; 

const mapStateToProps = ({ 
    controlTimelineHeight, 
    baseWidth, 
    controlScale, 
    verticalAlignerHeight
}) => 
({
    controlTimelineHeight, 
    baseWidth, 
    controlScale, 
    verticalAlignerHeight
}); 

export default connect(mapStateToProps, null, null, { context: PeripheryPlotContext })(getControlAligner);

import { connect } from 'react-redux'; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import { getTrack } from "./PeripheryPlotsPiecesConstructors"; 

function TrackDetached(props) {
    return getTrack(props, props.i); 
}

const mapStateToProps = ({ 
    baseWidth, 
    controlScale
}) => 
({ 
    baseWidth, 
    controlScale
}); 

export default connect(mapStateToProps, null, null, { context: PeripheryPlotContext })(TrackDetached);

// Enumeration defining all different possible 
// types of actions that can be performed to an 
// individual brush 
export const BRUSH_ACTIONS = {
  RESIZE_SHRINK_LEFT: 0, 
  RESIZE_SHRINK_RIGHT: 1, 
  RESIZE_GROW_LEFT: 2, 
  RESIZE_GROW_RIGHT: 3, 
  TRANSLATE_LEFT: 4, 
  TRANSLATE_RIGHT: 5
};

// Configuration parameters for the control timeline 
export const CONTROL_CONFIGURATION = {
  MARGIN: {
    left: 0, 
    right: 0, 
    top: 0, 
    bottom: 5
  },
  LOCK_WIDTH: 10, 
  LOCK_HEIGHT: 10, 
  LOCK_ACTIVE_COLOR: "grey", 
  LOCK_INACTIVE_COLOR: "black", 
  HANDLE_WIDTH: 12, 
  HANDLE_HEIGHT: 12, 
  MIN_CONTEXT_WIDTH: 24, 
  MIN_FOCUS_WIDTH: 24
}
// Define initial states
const initializePopupState = false;
const initialRecState = false;

// Define action type constants
const IS_POPUP_OPEN = "ISPOPUPOPEN";
const IS_POPUP_CLOSE = "ISPOPUPCLOSE";
const START_RECORDING = "STARTRECORDING";
const STOP_RECORDING = "STOPRECORDING";

// Reducer for managing popup status
const changePopupStatus = (state = initializePopupState, action) => {
  switch (action.type) {
    case IS_POPUP_OPEN:
      return true;
    case IS_POPUP_CLOSE:
      return false;
    default:
      return state;
  }
};

// Reducer for managing recording status
const changeRecStatus = (state = initialRecState, action) => {
  switch (action.type) {
    case START_RECORDING:
      return true;
    case STOP_RECORDING:
      return false;
    default:
      return state;
  }
};

// Export reducers
export { changePopupStatus, changeRecStatus };

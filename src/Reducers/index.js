import { combineReducers } from "react-redux";
import { changeRecStatus, changePopupStatus } from "./popupStatus";

const rootReducer = combineReducers({
  changePopupStatus,
  changeRecStatus,
});

export default rootReducer;

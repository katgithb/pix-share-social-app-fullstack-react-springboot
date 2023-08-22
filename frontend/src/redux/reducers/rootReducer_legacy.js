import { combineReducers } from "redux";
import { authReducer } from "./auth/authReducer_legacy";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;

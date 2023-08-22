import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/authSlice";

// legacy redux store
// const store = createStore(rootReducer, applyMiddleware(thunk));

const store = configureStore({
  devTools: true,
  reducer: {
    auth: authReducer,
  },
});

export default store;

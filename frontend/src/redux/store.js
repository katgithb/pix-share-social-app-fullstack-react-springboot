import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/authSlice";
import userLookupReducer from "./reducers/user/userLookupSlice";
import userProfileReducer from "./reducers/user/userProfileSlice";
import userSocialReducer from "./reducers/user/userSocialSlice";
import postManagementReducer from "./reducers/post/postManagementSlice";

const store = configureStore({
  devTools: true,
  reducer: {
    auth: authReducer,
    user: combineReducers({
      userProfile: userProfileReducer,
      userLookup: userLookupReducer,
      userSocial: userSocialReducer,
    }),
    post: combineReducers({
      postManagement: postManagementReducer,
    }),
  },
});

export default store;

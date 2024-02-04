import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/authSlice";
import postInteractionReducer from "./reducers/post/postInteractionSlice";
import postLookupReducer from "./reducers/post/postLookupSlice";
import postManagementReducer from "./reducers/post/postManagementSlice";
import postSocialReducer from "./reducers/post/postSocialSlice";
import userLookupReducer from "./reducers/user/userLookupSlice";
import userProfileReducer from "./reducers/user/userProfileSlice";
import userSocialReducer from "./reducers/user/userSocialSlice";

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
      postLookup: postLookupReducer,
      postSocial: postSocialReducer,
      postInteraction: postInteractionReducer,
    }),
  },
});

export default store;

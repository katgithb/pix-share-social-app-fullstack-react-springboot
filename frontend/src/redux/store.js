import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/authSlice";
import commentManagementReducer from "./reducers/comment/commentManagementSlice";
import commentSocialReducer from "./reducers/comment/commentSocialSlice";
import postInteractionReducer from "./reducers/post/postInteractionSlice";
import postLookupReducer from "./reducers/post/postLookupSlice";
import postManagementReducer from "./reducers/post/postManagementSlice";
import postSocialReducer from "./reducers/post/postSocialSlice";
import userLookupReducer from "./reducers/user/userLookupSlice";
import userProfileReducer from "./reducers/user/userProfileSlice";
import userSocialReducer from "./reducers/user/userSocialSlice";

const store = configureStore({
  devTools: import.meta.env.VITE_REDUX_DEVTOOLS === "true",
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
    comment: combineReducers({
      commentManagement: commentManagementReducer,
      commentSocial: commentSocialReducer,
    }),
  },
});

export default store;

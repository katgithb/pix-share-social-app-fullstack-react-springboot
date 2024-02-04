import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePostId: null,
};

const postInteractionSlice = createSlice({
  name: "postInteraction",
  initialState: initialState,
  reducers: {
    setActivePostId: (state, action) => {
      state.activePostId = action.payload;
    },

    clearPostInteraction: () => initialState,
  },
});

export const { setActivePostId, clearPostInteraction } =
  postInteractionSlice.actions;
export default postInteractionSlice.reducer;

import {
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
} from "../../actions/auth/authActionTypes_legacy";

const initialState = {
  signup: null,
  signin: null,
  isAuthenticated: false,
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SIGN_IN:
      return { ...state, signin: payload, isAuthenticated: true };

    case SIGN_UP:
      return { ...state, signup: payload };

    case SIGN_OUT:
      return {
        ...state,
        signup: null,
        signin: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

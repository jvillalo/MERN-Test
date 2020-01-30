import { SET_LOADING, GET_USERS, USERS_ERROR } from "../actions/types";

const initialState = {
  users: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return {
        ...state,

        loading: true
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false
      };

    case USERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        users: null
      };
    default:
      return state;
  }
}

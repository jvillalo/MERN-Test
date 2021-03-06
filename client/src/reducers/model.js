import { SET_LOADING, GET_MODELS, USERS_ERROR, GET_MODEL } from "../actions/types";

const initialState = {
  models: [],
  model:null,
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
    case GET_MODELS:
      return {
        ...state,
        models: payload,
        loading: false
      };

      case GET_MODEL:
      return {
        ...state,
        model: payload,
        loading: false
      };
    case USERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        models: null
      };
    default:
      return state;
  }
}

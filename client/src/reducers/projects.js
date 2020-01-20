import { GET_PROJECTS, PROJECT_ERROR, GET_PROJECT } from "../actions/types";

const initialState = {
  projects: [],
  project: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        project: null,
        loading: false
      };

    case GET_PROJECT:
      return {
        ...state,
        projects: null,
        project: payload,
        loading: false
      };

    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    default:
      return state;
  }
}

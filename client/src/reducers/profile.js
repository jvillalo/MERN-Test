import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_PROFILEFORDISPLAY,
  CLEAR_PROFILEFORDISPLAY
} from "../actions/types";

const initialState = {
  profile: null,
  displayedProfile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PROFILE:
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        displayedProfile: null,
        loading: false
      };
    case GET_PROFILEFORDISPLAY:
      return {
        ...state,
        displayedProfile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
        displayedProfile: null
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
        repos: [],
        displayedProfile: null
      };

    case CLEAR_PROFILEFORDISPLAY:
      return {
        ...state,
        displayedProfile: null,
        loading: false,
        repos: []
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
        displayedProfile: null // Add this
      };
    default:
      return state;
  }
}

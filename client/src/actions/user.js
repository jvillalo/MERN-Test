import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_USERS,
  USERS_ERROR,
  SET_LOADING
} from "./types";

export const getUsers = () => async dispatch => {
  try {
    dispatch({
      type: SET_LOADING
    });
    const res = await axios.get("/api/users");
    dispatch({
      type: GET_USERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
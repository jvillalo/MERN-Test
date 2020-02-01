import axios from "axios";
import { setAlert } from "./alert";

import { GET_MODELS, USERS_ERROR, SET_LOADING, GET_MODEL } from "./types";

export const getModels = () => async dispatch => {
  try {
    dispatch({
      type: SET_LOADING
    });
    const res = await axios.get("/api/models");
    dispatch({
      type: GET_MODELS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


export const getModelById = (ModelId) => async dispatch => {
  try {
    dispatch({
      type: SET_LOADING
    });
    const res = await axios.get(`/api/models/${ModelId}`);
    dispatch({
      type: GET_MODEL,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


export const publishModel = (
  name,
  description,
  project,
  json
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const postText = {
      name: name,
      description: description,
      project: project,
      json: json
    };

    const res = await axios.post(`/api/models/`, postText, config);
    //console.log(res.data);

    dispatch({
      type: GET_MODEL,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

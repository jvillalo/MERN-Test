import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROJECTS,
  PROJECT_ERROR,
  GET_PROJECT,
  COMMIT_MODEL
} from "./types";

export const getProjects = () => async dispatch => {
  try {
    const res = await axios.get("/api/projects/mine");
    dispatch({
      type: GET_PROJECTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getProject = projectId => async dispatch => {
  try {
    const res = await axios.get(`/api/projects/${projectId}`);
    //console.log(res.data);
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const branchModel = (projectId, model) => async dispatch => {
  try {
    dispatch({
      type: COMMIT_MODEL
    });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const postText = {
      name: `${model.name} branch`,
      json: model.json,
      parent: model._id
    };

    const res = await axios.post(
      `/api/projects/${projectId}/models`,
      postText,
      config
    );
    //alert(res);

    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });

    dispatch(setAlert("Branch created", "success"));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const commitModel = (projectId, modelId) => async dispatch => {
  try {
    dispatch({
      type: COMMIT_MODEL
    });
    const res = await axios.get(
      `/api/projects/${projectId}/commitmodel/${modelId}`
    );

    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });

    dispatch(setAlert("Branch commited", "success"));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeModel = (projectId, modelId) => async dispatch => {
  try {
    alert(`/api/projects/${projectId}/models/${modelId}`);
    const res = await axios.delete(
      `/api/projects/${projectId}/models/${modelId}`
    );
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

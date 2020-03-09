import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROJECTS,
  PROJECT_ERROR,
  GET_PROJECT,
  COMMIT_MODEL,
  SET_LOADING,
  GET_USERS
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

export const createProject = (name, description, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const postText = {
      name: name,
      description: description
    };

    const res = await axios.post(`/api/projects/`, postText, config);
    //console.log(res.data);
    history.push("/dashboard");
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

export const setProject = project => async dispatch => {
  dispatch({
    type: GET_PROJECT,
    payload: project
  });
};

export const newCommit = (projectId, model, socket) => async dispatch => {
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
      name: model.name,
      json: model.json,
      parent: null
    };

    const res = await axios.post(
      `/api/projects/${projectId}/models`,
      postText,
      config
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
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

export const branchModel = (projectId, model, socket) => async dispatch => {
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
      name: `${model.name}`,
      json: model.json,
      parent: model._id
    };

    const res = await axios.post(
      `/api/projects/${projectId}/models`,
      postText,
      config
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
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

export const createModel = (
  projectId,
  name,
  json,
  history,
  socket
) => async dispatch => {
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
      name: name,
      json: json,
      parent: null
    };

    const res = await axios.post(
      `/api/projects/${projectId}/models`,
      postText,
      config
    );

    //alert(res);
    socket.emit("setproject", projectId);
    socket.disconnect();

    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
    if (history != null) {
      history.push(`/projects/${projectId}`);
    }
    dispatch(setAlert("Branch created", "success"));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const commitModel = (projectId, modelId, socket) => async dispatch => {
  try {
    dispatch({
      type: COMMIT_MODEL
    });
    const res = await axios.get(
      `/api/projects/${projectId}/commitmodel/${modelId}`
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
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

export const restoreModel = (projectId, modelId, socket) => async dispatch => {
  try {
    dispatch({
      type: COMMIT_MODEL
    });
    const res = await axios.get(
      `/api/projects/${projectId}/restoremodel/${modelId}`
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });

    dispatch(setAlert("Version restored", "success"));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeModel = (projectId, modelId, socket) => async dispatch => {
  try {
    //alert(`/api/projects/${projectId}/models/${modelId}`);
    const res = await axios.delete(
      `/api/projects/${projectId}/models/${modelId}`
    );

    socket.emit("setproject", projectId);
    socket.disconnect();
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

export const addUsers = (projectId, userId, role, socket) => async dispatch => {
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
      user: userId,
      role: role
    };

    const res2 = await axios.post(
      `/api/projects/${projectId}/users`,
      postText,
      config
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
    const res = await axios.get(`/api/projects/${projectId}`);
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
    //console.log(res.data);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const upgrade = (projectId, userId, socket) => async dispatch => {
  alert("here");
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
      user: userId
    };

    const res = await axios.put(
      `/api/projects/${projectId}/upgrade/${userId}`,
      postText,
      config
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
    //console.log(res.data);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const downgrade = (projectId, userId, socket) => async dispatch => {
  alert("here");
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
      user: userId
    };

    const res = await axios.put(
      `/api/projects/${projectId}/downgrade/${userId}`,
      postText,
      config
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
    //console.log(res.data);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const removeUser = (projectId, userId, socket) => async dispatch => {
  alert("here");
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
      user: userId
    };

    const res = await axios.delete(
      `/api/projects/${projectId}/users/${userId}`,
      postText,
      config
    );
    socket.emit("setproject", projectId);
    socket.disconnect();
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
    //console.log(res.data);
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

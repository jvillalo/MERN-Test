import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import post from "./post";
import projects from "./projects";
import users from "./users";
import models from "./model";

export default combineReducers({
  alert,
  auth,
  post,
  projects,
  users,
  models
});

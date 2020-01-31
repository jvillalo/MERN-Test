import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";
import projects from "./projects";
import users from "./users";
import models from "./model";

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  projects,
  users,
  models
});

import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";
import Posts from "./components/posts/Posts";
import Post from "./components/posts/Post";
import TestModel from "./components/TestModel";
import Projects from "./components/project/Projects";
import Project from "./components/project/Project";
import Model from "./components/model/Model";
import NewProject from "./components/project/NewProject";
import Users from "./components/users/Users";
import Models from "./components/model/Models";
import DisplayModel from "./components/model/DisplayModel";
import ProjectLanding from "./components/project/ProjectLanding";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />

          <Switch>
            <section className="container2">
              <Alert />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/models/:id" component={DisplayModel} />
              <Route exact path="/models" component={Models} />
              <PrivateRoute
                exact
                path="/create-project"
                component={NewProject}
              />
              <PrivateRoute exact path="/users" component={Users} />
              <PrivateRoute exact path="/dashboard" component={Projects} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/projects" component={Projects} />
              <PrivateRoute
                exact
                path="/projects/:id"
                component={ProjectLanding}
              />
              <PrivateRoute
                exact
                path="/projects/models/:id"
                component={Model}
              />
            </section>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

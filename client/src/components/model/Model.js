import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import Posts from "../posts/Posts";
//import CommentForm from '../post/CommentForm';
//import CommentItem from '../post/CommentItem';
import { getPosts } from "../../actions/post";
import { getProject } from "../../actions/projects";
import TestModel from "../TestModel";
import "../../../src/App.css";
import io from "socket.io-client";

const Model = ({
  auth,
  projects: { project, loading },
  match,
  getPosts,
  history
}) => {
  const socket = io();
  useEffect(() => {
    //getP  osts(modelId);

    socket.on("reconn", msg => {
      socket.emit("reconnection", match.params.id);
    });
  }, []);

  var authorized = false;
  project.users.map(usr => {
    if (usr.user == auth.user._id) {
      if (usr.role == "Administrator" || usr.role == "Collaborator") {
        authorized = true;
      } else {
        authorized = false;
      }
    }
  });
  /*
  if (authorized) {
    project.models.map(mod => {
      if (mod._id == match.params.id) {
        if (mod.parent != null) {
          authorized = true;
        } else {
          authorized = false;
        }
      }
    });
  }*/

  return (
    <Fragment>
      <button
        className="btn btn-danger"
        onClick={() => {
          socket.disconnect();
          history.push(`/projects/${project._id}`);
        }}
      >
        Back To Project
      </button>
      <br></br>
      <br></br>

      <div className="mod">
        <TestModel
          userId={auth.user._id}
          userName={auth.user.name}
          modelId={match.params.id}
          projectId={project._id}
          editAuthorized={authorized}
          getPosts={getPosts}
          socket={socket}
          room={match.params.id}
          //editAuthorized={model.parent == null ? true : false}
        />

        <Posts
          projectId={project._id}
          modelId={match.params.id}
          socket={socket}
          room={match.params.id}
        />
      </div>
    </Fragment>
  );
};

Model.propTypes = {
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  auth: state.auth
});

export default connect(mapStateToProps, { getPosts })(withRouter(Model));

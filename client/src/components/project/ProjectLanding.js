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
import Project from "./Project";

const ProjectLanding = ({
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
          history.push(`/projects/`);
          socket.disconnect();
        }}
      >
        Back to Dashboard
      </button>
      <br></br>
      <br></br>

      <div className="mod">
        <Project
          projectId={match.params.id}
          socket={socket}

          //editAuthorized={model.parent == null ? true : false}
        />

        <Posts
          projectId={match.params.id}
          modelId={match.params.id}
          socket={socket}
          room={match.params.id}
        />
      </div>
    </Fragment>
  );
};

ProjectLanding.propTypes = {
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  auth: state.auth
});

export default connect(mapStateToProps, { getPosts })(
  withRouter(ProjectLanding)
);

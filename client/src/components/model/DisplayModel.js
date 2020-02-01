import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import Posts from "../posts/Posts";
//import CommentForm from '../post/CommentForm';
//import CommentItem from '../post/CommentItem';
import { getPosts } from "../../actions/post";
import { getProject } from "../../actions/projects";
import ModelToDisplay from "../ModelToDisplay";
import "../../../src/App.css";
import io from "socket.io-client";
import { getModelById } from "../../actions/models";

const DisplayModel = ({
  auth,
  match,
  getModelById,
  models: { models, model, loading }
}) => {
  useEffect(() => {
    getModelById(match.params.id);
  }, [getModelById]);

  var authorized = false;

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

  return loading || model === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h3>Model {model.name}</h3>
      <p>{model.description}</p>
      {models.length > 0 ? (
        <Link to={`/models`} className="btn">
          Back To Models
        </Link>
      ) : (
        ""
      )}
      <br></br>
      <br></br>
      <div className="mod">
        <ModelToDisplay
          model={model}
          editAuthorized={authorized}

          //editAuthorized={model.parent == null ? true : false}
        />
      </div>
    </Fragment>
  );
};

DisplayModel.propTypes = {
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  getModelById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  auth: state.auth,
  models: state.models
});

export default connect(mapStateToProps, { getPosts, getModelById })(
  DisplayModel
);

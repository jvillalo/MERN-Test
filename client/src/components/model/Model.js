import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import Posts from "../posts/Posts";
//import CommentForm from '../post/CommentForm';
//import CommentItem from '../post/CommentItem';
import { getProject } from "../../actions/projects";
import TestModel from "../TestModel";
import "../../../src/App.css";

const Model = ({ auth, projects: { project, loading }, match }) => {
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
  }

  return (
    <Fragment className="modelContainer">
      <Link to={`/projects/${project._id}`} className="btn">
        Back To Project
      </Link>
      <br></br>
      <br></br>
      <table>
        <tr>
          <td>
            <div>
              <TestModel
                userId={auth.user._id}
                modelId={match.params.id}
                projectId={project._id}
                editAuthorized={authorized}
                //editAuthorized={model.parent == null ? true : false}
              />
            </div>
          </td>
          <td>
            <td>
              <div className="postsdiv">
                <Posts />
              </div>
            </td>
          </td>
        </tr>
      </table>
      <br></br>
      <br></br>
      <br></br>
    </Fragment>
  );
};

Model.propTypes = {
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  auth: state.auth
});

export default connect(mapStateToProps)(Model);

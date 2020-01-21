import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";

//import CommentForm from '../post/CommentForm';
//import CommentItem from '../post/CommentItem';
import { getProject } from "../../actions/projects";
import TestModel from "../TestModel";

const Model = ({ auth, projects: { project, loading }, match }) => {
  return (
    <Fragment>
      <Link to="/projects" className="btn">
        Back To Projects
      </Link>
      <TestModel
        userId={auth.user._id}
        modelId={match.params.id}
        projectId={project._id}
      />
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

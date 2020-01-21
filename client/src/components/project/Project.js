import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProjectModels from "./ProjectModels";
import ProjectUsers from "./ProjectUsers";
//import CommentForm from '../post/CommentForm';
//import CommentItem from '../post/CommentItem';
import { getProject } from "../../actions/projects";

const Project = ({ getProject, projects: { project, loading }, match }) => {
  useEffect(() => {
    console.log(match.params.id);
    getProject(match.params.id);
  }, [getProject]);

  return loading || project === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/projects" className="btn">
        Back To Projects
      </Link>
      <ProjectUsers users={project.users} />
      <ProjectModels models={project.models} />
    </Fragment>
  );
};

Project.propTypes = {
  getProject: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(mapStateToProps, { getProject })(Project);

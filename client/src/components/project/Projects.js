import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../layout/Spinner";

import ProjectList from "./ProjectList";
import { getProjects } from "../../actions/projects";
const Projects = ({
  auth: { user },

  projects: { projects, loading },
  getProjects
}) => {
  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return loading && projects === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h2>Welcome {user && user.name}</h2>
      <br></br>

      {projects !== null ? (
        <Fragment>
          <ProjectList projects={projects} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You don't have any projects yet</p>
        </Fragment>
      )}
      <Link to="/create-project" className="btn btn-primary my-1">
        Create New Project
      </Link>
    </Fragment>
  );
};

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects
});

export default connect(mapStateToProps, { getProjects })(Projects);

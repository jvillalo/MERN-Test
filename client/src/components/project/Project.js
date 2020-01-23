import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProjectModels from "./ProjectModels";
import ProjectUsers from "./ProjectUsers";
import Posts from "../posts/Posts";
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
      <table>
        <tr>
          <td>
            <Link to="/projects" className="btn">
              Back To Projects
            </Link>
            <br></br>
            <br></br>
            <br></br>
            <h2>Project {project.name}</h2>
            <div className="projdiv">
              <ProjectModels project={project} id={project._id} />
              <ProjectUsers users={project.users} />
            </div>
          </td>
          <td>
            <td>
              <div>
                <Posts />
              </div>
            </td>
          </td>
        </tr>
      </table>
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

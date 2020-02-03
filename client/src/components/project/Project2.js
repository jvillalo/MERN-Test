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
import { getProject, setProject } from "../../actions/projects";
import { publishModel } from "../../actions/models";
import io from "socket.io-client";

const Project = ({
  publishModel,
  getProject,
  projects: { project, loading },
  match,
  setProject
}) => {
  var socket = io();
  var test = 0;
  var pro = null;
  useEffect(() => {
    if (project === null) {
      //getProject(match.params.id);
    }
    //getProject(match.params.id);
    socket.on("reconn", msg => {
      socket.emit("reconnection", match.params.id);
    });
    socket.emit("setproject", match.params.id);

    socket.on("project", msg => {
      alert("KKKK");
      setProject(msg);
    });
  }, []);

  return project === null ? (
    pro - <Spinner />
  ) : (
    <Fragment>
      <table>
        <tr>
          <td>
            <Link to="/projects" className="btn">
              Back To Projects
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => {
                socket.disconnect();
              }}
            >
              disconnect
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                socket.emit("setproject", match.params.id);
              }}
            >
              Emit
            </button>
            <br></br>
            <br></br>
            <br></br>
            <h2>Project {project.name}</h2>
            <div className="projdiv">
              <ProjectModels
                project={project}
                id={project._id}
                publishModel={publishModel}
              />
              <Link to="/users" className="btn">
                Add New Participants
              </Link>
              <ProjectUsers users={project.users} />
              <Posts
                projectId={project._id}
                modelId={match.params.id}
                socket={socket}
                room={match.params.id}
                test={test}
              />
            </div>
          </td>
          <td>
            <td>
              <div></div>
            </td>
          </td>
        </tr>
      </table>
    </Fragment>
  );
};

Project.propTypes = {
  getProject: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
  publishModel: PropTypes.func.isRequired,
  setProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(mapStateToProps, {
  publishModel,
  getProject,
  setProject
})(Project);

import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProjectModels from "./ProjectModels";
import ProjectUsers from "./ProjectUsers";
import Posts from "../posts/Posts";
//import CommentForm from '../post/CommentForm';
//import CommentItem from '../post/CommentItem';
import {
  getProject,
  setProject,
  upgrade,
  downgrade,
  removeUser
} from "../../actions/projects";
import { publishModel } from "../../actions/models";
import Users from "./Users";
import io from "socket.io-client";

const Project = ({
  projectId,
  publishModel,
  getProject,
  projects: { project, loading },
  auth: { user },
  match,
  setProject,
  socket,
  upgrade,
  downgrade,
  removeUser
}) => {
  //var socket = io();

  useEffect(() => {
    //getProject(match.params.id);

    //socket.emit("setproject", projectId);
    socket.emit("requestproject", projectId);
    socket.on("project", msg => {
      setProject(msg);
    });
  }, []);

  const [displayUsers, setDisplayUsers] = useState({
    display: false
  });

  return loading || project === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <table>
        <tr>
          <td>
            <br></br>
            <br></br>
            <br></br>
            <h2>Project {project.name}</h2>
            <div className="projdiv">
              <ProjectModels
                project={project}
                id={project._id}
                publishModel={publishModel}
                socket={socket}
                user={user}
              />

              <ProjectUsers
                users={project.users}
                project={project._id}
                upgrade={upgrade}
                downgrade={downgrade}
                socket={socket}
                removeUser={removeUser}
              />
              <button
                className="btn"
                onClick={() =>
                  setDisplayUsers({ display: !displayUsers.display })
                }
              >
                Add New Participants
              </button>
              {displayUsers.display ? <Users socket={socket} /> : ""}
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
  setProject: PropTypes.func.isRequired,
  upgrade: PropTypes.func.isRequired,
  downgrade: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  auth: state.auth
});

export default connect(mapStateToProps, {
  publishModel,
  getProject,
  setProject,
  upgrade,
  downgrade,
  removeUser
})(Project);

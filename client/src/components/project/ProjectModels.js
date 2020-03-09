import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import Models from "./Models";
import {
  branchModel,
  commitModel,
  restoreModel,
  newCommit,
  removeModel,
  getProject,
  createModel
} from "../../actions/projects";
import { Link, withRouter } from "react-router-dom";

const ProjectModels = ({
  project,
  id,
  branchModel,
  commitModel,
  restoreModel,
  newCommit,
  removeModel,
  getProject,
  createModel,
  publishModel,
  socket,
  history,
  user
}) => {
  var models = project.models;
  var editable = null;

  const index2 = project.users.map(item => item.user).indexOf(user._id);
  const role = project.users[index2].role;

  for (let i = 0; i < models.length; i++) {
    if (models[i].parent != null) {
      editable = models.splice(i, 1);
      break;
    }
  }

  const vrsns = models.slice(0).map((mod, index) => (
    <tr key={mod._id}>
      <td>{mod.date}</td>

      {!mod.parent ? (
        <td>
          <Link to={`models/${mod._id}`} className="btn btn-primary">
            View model
          </Link>
          {role === "Administrator" && (
            <button
              className="btn"
              onClick={() => {
                var name = prompt("Please enter the model's name", "mod1");
                var desc = prompt(
                  "Please enter the model's description",
                  "desc"
                );
                if (name != "" || desc != "") {
                  publishModel(name, desc, id, mod.json);
                }
              }}
            >
              Publish
            </button>
          )}
          {role === "Administrator" && (
            <button className="btn" onClick={() => version(id, mod)}>
              Use version
            </button>
          )}
        </td>
      ) : (
        ""
      )}
    </tr>
  ));

  const mdls =
    editable &&
    editable.slice(0).map((mod, index) => (
      <tr key={mod._id}>
        <td>{mod.name}</td>

        {!mod.parent ? (
          ""
        ) : (
          <td>
            <button
              className="btn"
              onClick={() => {
                socket.disconnect();
                history.push(`models/${mod._id}`);
              }}
            >
              EDIT MODEL
            </button>
            {role === "Administrator" && (
              <button
                className="btn btn-danger"
                //STARTS HERE
                onClick={() => {
                  newCommit(id, mod, socket);
                  socket.disconnect();
                }}
              >
                Commit
              </button>
            )}{" "}
            {role === "Administrator" && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  branchModel(id, mod);
                  socket.disconnect();
                }}
              >
                Discard
              </button>
            )}
          </td>
        )}
      </tr>
    ));
  const commit = (models, mod, project) => {
    commitModel(project._id, mod._id, socket);
    socket.disconnect();
    //removeModel(project._id, mod._id);
  };

  const version = (id, mod) => {
    if (project.models.length > 1) {
      restoreModel(id, mod, socket);
      socket.disconnect();
    } else {
      branchModel(id, mod, socket);
      socket.disconnect();
    }
    //removeModel(project._id, mod._id);
  };
  return (
    <Fragment>
      <h2 className="my-2">Model</h2>
      {project.models.length === 0 ? (
        <div>
          <button
            className="btn btn-danger"
            onClick={() =>
              createModel(
                id,
                "mod1",
                `[{"name":"mod1","lockedByUser": 0,"levels":[]}]`,
                null,
                socket
              )
            }
          >
            New Model
          </button>
          <Link to="/models" className="btn">
            Import Model
          </Link>
          <Models socket={socket} />
        </div>
      ) : (
        ""
      )}

      {project.models.length > 0 ? (
        <Fragment>
          <table className="table">
            <thead>
              <tr>
                <th>Current Model</th>
                <th></th>
              </tr>
            </thead>
            {mdls ? <tbody>{mdls}</tbody> : ""}
          </table>
          <h2 className="my-2">Versions</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Created on:</th>
                <th>Versions</th>
              </tr>
            </thead>

            <tbody>{vrsns}</tbody>
          </table>
        </Fragment>
      ) : (
        ""
      )}
    </Fragment>
  );
};

ProjectModels.propTypes = {
  branchModel: PropTypes.func.isRequired,
  commitModel: PropTypes.func.isRequired,
  removeModel: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  createModel: PropTypes.func.isRequired,
  restoreModel: PropTypes.func.isRequired
};

export default connect(null, {
  getProject,
  branchModel,
  commitModel,
  newCommit,
  removeModel,
  createModel,
  restoreModel
})(withRouter(ProjectModels));

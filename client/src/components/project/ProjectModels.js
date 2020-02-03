import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import Models from "./Models";
import {
  branchModel,
  commitModel,
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
  removeModel,
  getProject,
  createModel,
  publishModel,
  socket,
  history
}) => {
  const models = project.models;

  const mdls = models
    .slice(0)
    .reverse()
    .map((mod, index) => (
      <tr key={mod._id}>
        <td>{mod.name}</td>

        {index + 1 !== models.length ? (
          <td>
            <Link to={`models/${mod._id}`} className="btn btn-primary">
              View model
            </Link>

            <button
              className="btn btn-danger"
              onClick={() => publishModel("Mod1", "Lorem ipsum", id, mod.json)}
            >
              Publish
            </button>
          </td>
        ) : (
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                history.push(`models/${mod._id}`);
                socket.disconnect();
              }}
            >
              EDIT MODEL
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                branchModel(id, mod, socket);
              }}
            >
              Branch
            </button>
            {mod.parent != null ? (
              <button
                className="btn btn-danger"
                onClick={() => commit(models, mod, project, socket)}
              >
                Commit
              </button>
            ) : (
              ""
            )}
            <button
              className="btn btn-danger"
              onClick={() => branchModel(id, mod)}
            >
              Discard
            </button>
          </td>
        )}

        <td>
          <button className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));
  const commit = (models, mod, project, socket) => {
    commitModel(project._id, mod._id, socket);
    //removeModel(project._id, mod._id);
  };
  return (
    <Fragment>
      <h2 className="my-2">Models</h2>
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
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hide-sm">Id</th>

              <th />
            </tr>
          </thead>
          <tbody>{mdls}</tbody>
        </table>
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
  createModel: PropTypes.func.isRequired
};

export default connect(null, {
  getProject,
  branchModel,
  commitModel,
  removeModel,
  createModel
})(withRouter(ProjectModels));

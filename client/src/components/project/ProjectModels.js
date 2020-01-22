import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { branchModel, commitModel, removeModel } from "../../actions/projects";
import { Link } from "react-router-dom";

const ProjectModels = ({
  project,
  id,
  branchModel,
  commitModel,
  removeModel
}) => {
  const models = project.models;
  const mdls = models.map(mod => (
    <tr key={mod._id}>
      <td>{mod.name}</td>

      {mod.parent == null ? (
        <td>
          <Link to={`models/${mod._id}`} className="btn btn-primary">
            View model
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => branchModel(id, mod)}
          >
            Branch
          </button>
        </td>
      ) : (
        <td>
          <Link to={`models/${mod._id}`} className="btn btn-primary">
            Edit model
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => commit(models, mod, project)}
          >
            Commit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => branchModel(id, mod)}
          >
            Version
          </button>
        </td>
      )}

      <td>
        <button className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));
  const commit = (models, mod, project) => {
    console.log(models);
    console.log(mod);
    console.log(project);
    commitModel(models, mod, project._id);
    //removeModel(project._id, mod._id);
  };
  return (
    <Fragment>
      <h2 className="my-2">Models</h2>
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
    </Fragment>
  );
};

ProjectModels.propTypes = {
  branchModel: PropTypes.func.isRequired,
  commitModel: PropTypes.func.isRequired,
  removeModel: PropTypes.func.isRequired
};

export default connect(null, { branchModel, commitModel, removeModel })(
  ProjectModels
);

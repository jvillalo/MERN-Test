import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

const ModelItem = ({ model, projectId, createModel, history, socket }) => {
  return (
    <div className="profile">
      <h2>{model.name}</h2>
      <Link to={`/models/${model._id}`} className="btn">
        View Model
      </Link>
      <button
        className="btn btn-danger"
        onClick={() => {
          createModel(projectId, model.name, model.json, null, socket);
        }}
      >
        Add to project
      </button>
    </div>
  );
};

export default withRouter(ModelItem);

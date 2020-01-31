import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ModelItem = ({ model, projectId, createModel }) => {
  return (
    <div>
      <h2>{model.name}</h2>
      <button
        className="btn btn-danger"
        onClick={() => {
          createModel(projectId, model.name, model.json);
        }}
      >
        Add to project
      </button>
    </div>
  );
};

export default ModelItem;

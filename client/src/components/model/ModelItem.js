import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

const ModelItem = ({ model, createModel, history }) => {
  return (
    <div className="profile">
      <h2>{model.name}</h2>
      <Link to={`/models/${model._id}`} className="btn">
        View Model
      </Link>
    </div>
  );
};

export default withRouter(ModelItem);

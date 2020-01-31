import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ModelItem from "./ModelItem";
import Spinner from "../layout/Spinner";
import { getUsers } from "../../actions/user";
import { addUsers, createModel } from "../../actions/projects";
import { getModels, publishModel } from "../../actions/models";

const Models = ({
  addUsers,
  getModels,
  publishModel,
createModel,
  projects: { project },
  models: { models, loading }
}) => {
  useEffect(() => {
    getModels();
  }, [getModels]);

  return (
    <Fragment>
      {loading || models === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1>Models</h1>
          <div className="profiles">
            {models.length > 0 ? (
              models.map(model => (
                <ModelItem
                  key={model._id}
                  model={model}
                  projectId={project._id}
                  publishModel={publishModel}
                  loaading={loading}
                  createModel={createModel}
                />
              ))
            ) : (
              <h1> No models found</h1>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Models.propTypes = {
  getUsers: PropTypes.func.isRequired,
  addUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  getModels: PropTypes.func.isRequired,
  publishModel: PropTypes.func.isRequired,
  createModel:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  projects: state.projects,
  models: state.models
});

export default connect(mapStateToProps, {
  publishModel,
  getModels,
  addUsers,
  getUsers,
  createModel
})(Models);

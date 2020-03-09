import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProject } from "../../actions/projects";
import { Link, withRouter } from "react-router-dom";

const NewProject = ({ createProject, history }) => {
  const [formData, setFormData] = useState({
    name: "",

    desription: ""
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { description, name } = formData;

  return (
    <Fragment>
      <h1 className="large text-primary">New Project</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i>
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => {
          e.preventDefault();
          createProject(formData.name, formData.description, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Project Description"
            value={description}
            onChange={e => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link to="/dashboard" className="btn btn-light my-1">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

NewProject.propTypes = {
  createProject: PropTypes.func.isRequired
};

export default connect(null, { createProject })(NewProject);

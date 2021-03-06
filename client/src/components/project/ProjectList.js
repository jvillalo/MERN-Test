import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const ProjectList = ({ projects, getProject }) => {
  const projs = projects.map(proj => (
    <tr key={proj._id}>
      <td>{proj.name}</td>
      <td className="hide-sm">{proj.description}</td>
      <td>
        <Link to={`/projects/${proj._id}`} className="btn btn-primary">
          Go to project
        </Link>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Projects</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th className="hide-sm">Description</th>

            <th />
          </tr>
        </thead>
        <tbody>{projs}</tbody>
      </table>
    </Fragment>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.object.isRequired
};

export default ProjectList;

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";
import { Link } from "react-router-dom";

const ProjectModels = ({ models }) => {
  const mdls = models.map(mod => (
    <tr key={mod._id}>
      <td>{mod.name}</td>
      <td className="hide-sm">{mod.id}</td>

      <td>
        <Link to={`models/${mod._id}`} className="btn btn-primary">
          Go to model
        </Link>
      </td>
      <td>
        <button className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));
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
  project: PropTypes.object.isRequired
};

export default ProjectModels;

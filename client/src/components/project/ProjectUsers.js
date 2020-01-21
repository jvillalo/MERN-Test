import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";
import { Link } from "react-router-dom";

const ProjectUsers = ({ users }) => {
  const usrs = users.map(usr => (
    <tr key={usr._id}>
      <td>{usr.user}</td>
      <td className="hide-sm">{usr.role}</td>

      <td>
        <Link to={`/profile/${usr.user}`} className="btn btn-primary">
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
      <h2 className="my-2">Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th className="hide-sm">Role</th>

            <th />
          </tr>
        </thead>
        <tbody>{usrs}</tbody>
      </table>
    </Fragment>
  );
};

ProjectUsers.propTypes = {
  project: PropTypes.object.isRequired
};

export default ProjectUsers;

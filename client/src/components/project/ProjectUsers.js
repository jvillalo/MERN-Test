import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const ProjectUsers = ({
  users,
  upgrade,
  socket,
  project,
  downgrade,
  removeUser,
  user
}) => {
  const index2 = users.map(item => item.user).indexOf(user._id);
  const role = users[index2].role;

  const usrs = users.map(usr => (
    <tr key={usr._id}>
      <td>{usr.user}</td>
      <td className="hide-sm">{usr.role}</td>
      <td>
        {role === "Administrator" && usr.user != user._id ? (
          <button
            className="btn btn-danger"
            onClick={() => {
              removeUser(project, usr.user, socket);
              socket.disconnect();
            }}
          >
            Remove
          </button>
        ) : (
          ""
        )}
        {role === "Administrator" && usr.user != user._id ? (
          <button
            className="btn btn-danger"
            onClick={() => {
              upgrade(project, usr.user, socket);
              socket.disconnect();
            }}
          >
            Upgrade
          </button>
        ) : (
          ""
        )}
        {role === "Administrator" && usr.user != user._id ? (
          <button
            className="btn btn-danger"
            onClick={() => {
              downgrade(project, usr.user, socket);
              socket.disconnect();
            }}
          >
            Downgrade
          </button>
        ) : (
          ""
        )}
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

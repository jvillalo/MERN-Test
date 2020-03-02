import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import profilepic from "../../img/profile.jpg";
const UserItem = ({
  user: { _id, name },
  projectId,
  addUsers,
  getUsers,
  loading,
  socket
}) => {
  return (
    <div className="profile bg-light">
      <img src={profilepic} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
            addUsers(projectId, _id, "Administrator", socket);
          }}
        >
          Add to project
        </button>
      </div>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserItem;

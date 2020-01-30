import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UserItem = ({
  user: { _id, name, avatar },
  projectId,
  addUsers,
  getUsers,
  loading
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
            addUsers(projectId, _id, "Administrator");
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

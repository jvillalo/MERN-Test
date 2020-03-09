import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UserItem from "./UserItem";
import Spinner from "../layout/Spinner";
import { getUsers } from "../../actions/user";
import { addUsers, upgrade } from "../../actions/projects";
const Users = ({
  addUsers,
  getUsers,
  users: { users, loading },
  projects: { project },
  socket,
  upgrade
}) => {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1>Users</h1>
          <div className="profiles">
            {users.length > 0 ? (
              users.map(user =>
                project.users.findIndex(i => i.user === user._id) < 0 ? (
                  <UserItem
                    key={user._id}
                    user={user}
                    projectId={project._id}
                    addUsers={addUsers}
                    getUsers={getUsers}
                    loaading={loading}
                    socket={socket}
                    upgrade={upgrade}
                  />
                ) : (
                  ""
                )
              )
            ) : (
              <h1> No users found</h1>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Users.propTypes = {
  getUsers: PropTypes.func.isRequired,
  addUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  upgrade: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  projects: state.projects
});

export default connect(mapStateToProps, { addUsers, getUsers, upgrade })(Users);

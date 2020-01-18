import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileToDisplay } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";

const Profile = ({
  match,
  getProfileToDisplay,
  profile: { displayedProfile, loading },
  auth
}) => {
  useEffect(() => {
    getProfileToDisplay(match.params.id);
  }, [getProfileToDisplay, match.params.id]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : displayedProfile === null ? (
        <h1>Profile doesn't exist</h1>
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back to profiles
          </Link>

          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === displayedProfile.user._id && (
              <Link to="/edit.profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}

          <div className="profile-grid my-1">
            <ProfileTop profile={displayedProfile} />
            <ProfileAbout profile={displayedProfile} />

            {<ProfileExperience profile={displayedProfile} />}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileToDisplay: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStatetoProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStatetoProps, { getProfileToDisplay })(Profile);

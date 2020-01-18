import React from "react";
import PropTypes from "prop-types";

const ProfileExperience = ({ profile: { experience } }) => {
  return (
    <div className="profile-exp bg-white p-2">
      <h2 className="text-primary">Experience</h2>
      {experience.length > 0 ? (
        experience.map(exp => (
          <div key={exp._id}>
            <h3 className="text-dark">{exp.company}</h3>
            <p>
              {exp.from} - {exp.to === null ? "now" : exp.to}
            </p>
            <p>
              <strong>Position: </strong>
              {exp.title}
            </p>
            <p>
              <strong>Description: </strong>
              {exp.description}
            </p>
          </div>
        ))
      ) : (
        <h1>No exp info</h1>
      )}
    </div>
  );
};

ProfileExperience.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileExperience;

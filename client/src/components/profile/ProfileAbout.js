import React from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({profile:{
    bio,
    skills,
    user:{
        name
    }
}}) => {
    return (
        <div className="profile-about bg-light p-2">
          <h2 className="text-primary">{name}'s Bio</h2>
          <p>
            {bio}
          </p>
          <div className="line"></div>
          <h2 className="text-primary">Skill Set</h2>
          <div className="skills">
            
         
            
            {skills.map((skillname,index)=>(

<div className="p-1" key={index} ><i className="fa fa-check"></i> {skillname}</div>
          ))}
            
            
          </div>
        </div>
    )
}

ProfileAbout.propTypes = {
profile:PropTypes.object.isRequired,
}

export default ProfileAbout

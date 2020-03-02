import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deletePost } from "../../actions/post";
import profilepic from "../../img/profile.jpg";

const PostItem = ({
  deletePost,
  auth,
  post: { _id, text, name, date, comments, user },
  showActions
}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <img className="round-img" src={profilepic} alt="" />
          <h5>{name}</h5>
        </div>
        <div>
          <p className="postText my-1">{text}</p>
          <p className="post-date">Posted on {date}</p>
        </div>
      </div>
    </Fragment>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost })(PostItem);

import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  deletePost,
  removeLike,
  auth,
  post: { _id, text, name, date, likes, comments, avatar, user },
  showActions
}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`profile/${user}`}>
            <img className="round-img" src={avatar} alt="" />
            <h5>{name}</h5>
          </Link>
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
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);

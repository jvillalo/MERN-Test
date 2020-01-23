import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
const Posts = ({ modelId, getPosts, post: { post, loading } }) => {
  useEffect(() => {
    getPosts(modelId);
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="postsdiv">
        <PostForm modelId={modelId} />
      </div>
      <div className="postsdiv2">
        {post.comments.map(post => (
          <PostItem key={post._id} post={post} showActions={false} />
        ))}

        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,

  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);

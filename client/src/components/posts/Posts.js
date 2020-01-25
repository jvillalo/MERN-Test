import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { getPosts, loadPosts } from "../../actions/post";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import socketIOClient from "socket.io-client";
import { GET_POSTS } from "../../actions/types";

const Posts = ({
  socket,
  modelId,
  getPosts,
  post: { post, loading },
  loadPosts
}) => {
  var chat = null;

  useEffect(() => {
    //getPosts(modelId);
    socket.emit("chatrequest", modelId);

    socket.on("chat", msg => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(msg);
      chat = msg;
      loadPosts(msg);
    });
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="postsdiv">
        <PostForm modelId={modelId} socket={socket} chat={chat} />
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

export default connect(mapStateToProps, { loadPosts, getPosts })(Posts);

import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { getPosts, loadPosts, createChat } from "../../actions/post";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import socketIOClient from "socket.io-client";
import { GET_POSTS } from "../../actions/types";

const Posts = ({
  socket,
  modelId,
  projectId,
  getPosts,
  post: { post, loading },
  loadPosts,
  createChat
}) => {
  var chat = null;

  useEffect(() => {
    //getPosts(modelId);

    socket.emit("chatrequest", modelId);

    socket.on("chat", msg => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      chat = msg;
      if (msg != "no chat available") {
        loadPosts(msg);
      } else {
        createChat(projectId, modelId);
        socket.emit("chatrequest", modelId);
      }
    });
  }, []);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="chat">
        <div className="postsdiv">
          <PostForm modelId={modelId} socket={socket} chat={chat} />
        </div>
        <div className="postsdiv2">
          {post.comments.map(post => (
            <PostItem key={post._id} post={post} showActions={false} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};
Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,

  post: PropTypes.object.isRequired,
  createChat: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { createChat, loadPosts, getPosts })(
  Posts
);

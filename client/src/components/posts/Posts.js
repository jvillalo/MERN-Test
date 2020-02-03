import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { getPosts, loadPosts, createChat } from "../../actions/post";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import socketIOClient from "socket.io-client";
import { GET_POSTS } from "../../actions/types";
import io from "socket.io-client";

const Posts = ({
  socket,
  modelId,
  projectId,
  getPosts,
  post: { post, loading },
  loadPosts,
  createChat,
  room,
  projects: { project },
  match
}) => {
  var chat = null;
  useEffect(() => {
    //getPosts(modelId);
    alert("AAAARGH");
    socket.emit("chatrequest", {
      model: room,
      project: projectId
    });

    socket.on("chat", msg => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      chat = msg;
      if (msg != "no chat available") {
        loadPosts(msg);
      } else {
        createChat(projectId);
        socket.emit("chatrequest", {
          model: room,
          project: projectId
        });
      }
    });
  }, []);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="chat">
        <div className="postsdiv">
          <PostForm
            modelId={modelId}
            projectId={projectId}
            socket={socket}
            chat={chat}
          />
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
  createChat: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  projects: state.projects
});

export default connect(mapStateToProps, { createChat, loadPosts, getPosts })(
  Posts
);

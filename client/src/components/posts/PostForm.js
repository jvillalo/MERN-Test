import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost, getPosts } from "../../actions/post";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { GET_POSTS } from "../../actions/types";
const PostForm = ({
  modelId,
  addPost,
  getPosts,
  auth: { user },
  post: { post },
  socket,
  chat,
  projectId
}) => {
  const [text, setText] = useState("");

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h5>Application Forum</h5>
      </div>
      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault();
          //chat.chats.unshift()
          //addPost({ text }, modelId);

          const newComment = {
            text: text,
            name: user.name,
            avatar: user.avatar,
            user: user._id,
            date: Date.now()
          };
          var chats = post;
          chats.comments.unshift(newComment);

          socket.emit("chatupdate", { chats: chats, room: projectId });
          //getPosts(chat);
          setText("");
          //getPosts(modelId);
        }}
      >
        <textarea
          name="text"
          cols="40"
          rows="1"
          placeholder="Comment something"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired
};

const matchStateToProps = state => ({
  auth: state.auth,
  post: state.post
});

export default connect(matchStateToProps, { addPost, getPosts })(PostForm);

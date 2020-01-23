import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost, getPosts } from "../../actions/post";
import socketIOClient from "socket.io-client";

const PostForm = ({ modelId, addPost, getPosts }) => {
  const socket = socketIOClient();
  useEffect(() => {
    socket.on("chat", msg => {
      console.log("received");
      getPosts(modelId);
      //getPosts(match.params.id);
    });
  }, []);

  const [text, setText] = useState("");

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Application Forum</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault();
          addPost({ text }, modelId);
          setText("");

          socket.emit("newmsg");
          getPosts(modelId);
        }}
      >
        <textarea
          name="text"
          cols="20"
          rows="2"
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

export default connect(null, { addPost, getPosts })(PostForm);

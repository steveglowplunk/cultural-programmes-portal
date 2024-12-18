import React, { useState } from "react";
import axios from "axios";

interface CommentFormProps {
  locationId: string;
  username: string | undefined;
  onCommentAdded: () => void; // Callback function to notify when a comment is added
}

const CommentForm: React.FC<CommentFormProps> = ({ locationId, username, onCommentAdded }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`,
        {
          username,
          locationId,
          text,
          date: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText(""); // Clear the input field
      onCommentAdded(); // Notify CommentList of the new comment
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Comment:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;
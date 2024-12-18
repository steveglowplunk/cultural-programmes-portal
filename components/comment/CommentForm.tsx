import React, { useState } from "react";
import axios from "axios";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

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
      <div className="space-y-4 mt-2">
        <p className="font-bold text-2xl">Discussion</p>
        <InputTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="w-96 h-32"
        />
        <br />
        <Button type="submit">Add Comment</Button>
      </div>
    </form>
  );
};

export default CommentForm;
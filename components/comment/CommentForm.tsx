import React, { useState } from "react";
import axios from "axios";
import { date } from "zod";

interface CommentFormProps {
  locationId: string;
  username: string | undefined;
}

const CommentForm: React.FC<CommentFormProps> = ({ locationId, username }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // 假設令牌存儲在 localStorage 中
      console.log("username:", username);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`,
        {
          locationId,
          username,
          text,
          date: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText("");
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment here"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;

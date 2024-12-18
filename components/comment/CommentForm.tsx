import { useState } from "react";
import axios from "axios";

const CommentForm = ({ locationId }: { locationId: string }) => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/comments",
        { locationId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Comment added successfully");
      setText("");
    } catch (error) {
      setMessage("Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add your comment"
      />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CommentForm;

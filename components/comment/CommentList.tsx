import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  venue_id: string;
  username: string;
  text: string;
  date: string;
}

const CommentList = ({ locationId }: { locationId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/location/${locationId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();
  }, [locationId]);

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.date}>
          <p>{comment.text}</p>
          <p>By: {comment.username}</p>
          <p>Date: {new Date(comment.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

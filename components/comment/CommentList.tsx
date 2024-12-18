import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  venue_id: string;
  username: string;
  text: string;
  date: string;
}

const CommentList = ({ locationId, refresh }: { locationId: string, refresh: boolean }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/location/${locationId}`
        );
        console.log("the value of locationId:", locationId);
        console.log(
          "the access URL:",
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/location/${locationId}`
        );
        response.data.forEach((comment: Comment, index: number) => {
          console.log(`Comment ${index + 1}:`, comment);
        });
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();
  }, [locationId, refresh]); // Re-fetch comments when locationId or refresh changes

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div key={index}>
          <p>{comment.text}</p>
          <p>By: {comment.username}</p>
          <p>Date: {new Date(comment.date).toLocaleString("en-US")}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
import { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";

interface Comment {
  venue_id: string;
  username: string;
  text: string;
  date: string;
}

const CommentList = ({ locationId, username }: { locationId: string, username: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);

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

  useEffect(() => {
    fetchComments();
  }, [locationId]); // Re-fetch comments when locationId or refresh changes

  return (
    <div>
      <CommentForm
        locationId={locationId}
        username={username}
        onCommentAdded={fetchComments}
      />
      {comments.map((comment, index) => (
        <div key={index}>
          <p className="text-cyan-700">{comment.username}</p>
          <p>{new Date(comment.date).toLocaleString("en-US")}</p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
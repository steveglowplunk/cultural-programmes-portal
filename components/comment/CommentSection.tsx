import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentsSectionProps {
  locationId: string;
  username: string | undefined;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ locationId, username }) => {
  const [refresh, setRefresh] = useState(false);

  const handleCommentAdded = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger re-fetching
  };

  return (
    <div>
      <CommentForm locationId={locationId} username={username} onCommentAdded={handleCommentAdded} />
      <CommentList locationId={locationId} refresh={refresh} />
    </div>
  );
};

export default CommentsSection;
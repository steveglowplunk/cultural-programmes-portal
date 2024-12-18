import { Request, Response, NextFunction } from "express";
import { comments } from "../data/Comments";

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, locationId, text } = req.body;
    const newComment = {
      venue_id: locationId,
      username: userId, // 假設 userId 是 username，這裡可能需要根據實際情況調整
      text,
      date: new Date(),
    };

    // 將新評論添加到 comments 數組中
    comments.push(newComment);
    res.status(201).send(newComment);
  } catch (error) {
    next(error); // 將錯誤傳遞給 Express 的錯誤處理中間件
  }
};

export const getCommentsByLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locationId } = req.params;
    const locationComments = comments.filter(
      (comment) => comment.venue_id === locationId
    );
    res.status(200).send(locationComments);
  } catch (error) {
    next(error); // 將錯誤傳遞給 Express 的錯誤處理中間件
  }
};

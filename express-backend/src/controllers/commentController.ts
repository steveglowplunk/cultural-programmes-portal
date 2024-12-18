import { Request, Response, NextFunction } from "express";
import { comments } from "../data/Comments";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {Comment} from "../models/Comment"; // Import the Comment model

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, locationId, text, date } = req.body;
    const newComment = {
      venue_id: locationId,
      username: username, // 假設 userId 是 username，這裡可能需要根據實際情況調整
      text,
      date: new Date().toISOString(),
    };
    // 將新評論添加到 comments 數組中
    const commentsFilePath = path.join(__dirname, "../data/Comments.ts");
    comments.push(newComment);
    const datacomment = new Comment({
      user: username.toString(),
      location: locationId.toString(),
      text: text.toString(),
      createdAt: new Date(date).toISOString(),
    });
    await datacomment.save();
    // 將評論數據寫入 Comments.ts 文件

    const commentsFileContent = `export const comments = ${JSON.stringify(
      comments,
      null,
      2
    )};`;

    fs.writeFile(commentsFilePath, commentsFileContent, (err) => {
      if (err) {
        console.error("Failed to write comments to file", err);
        return next(err);
      }
      console.log("Comments successfully written to file");
      res.status(201).send(newComment);
    });
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
    // locationComments.forEach((comment, index) => {
    //   console.log(`Comment ${index + 1}:`, comment);
    // });
    res.status(200).send(locationComments);
  } catch (error) {
    next(error); // 將錯誤傳遞給 Express 的錯誤處理中間件
  }
};

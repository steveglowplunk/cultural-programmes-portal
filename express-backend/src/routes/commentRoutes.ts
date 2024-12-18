import express, {
  Router,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import {
  addComment,
  getCommentsByLocation,
} from "../controllers/commentController";
import { expressjwt } from "express-jwt";

const router = Router();
const SECRET_KEY = "your_secret_key"; // 請使用更安全的密鑰

// JWT 驗證中間件
const authenticate = expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] });

export function setCommentRoutes(app: Express) {
  // 添加評論
  router.post(
    "/comments",
    authenticate as any,
    (req: Request, res: Response, next: NextFunction) => {
      addComment(req, res, next);
    }
  );

  // 獲取特定位置的評論
  router.get(
    "/comments/location/:locationId",
    (req: Request, res: Response, next: NextFunction) => {
      getCommentsByLocation(req, res, next);
    }
  );

  app.use("/api", router);
}

import { Router, Express } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

export function setAuthRoutes(app: Express) {
  router.post("/login", (req, res, next) => {
    authController.verifyUser(req, res, next);
  });
  router.post("/signup", (req, res, next) => {
    authController.signup(req, res, next);
  });
  app.use("/api/auth", router);
}

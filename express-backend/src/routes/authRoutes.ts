import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

interface App {
  use(path: string, router: Router): void;
}

interface AuthControllerInterface {
  verifyUser(req: any, res: any, next: any): void;
}

export function setAuthRoutes(app: App) {
  app.use("/api/auth", router);
  router.post(
    "/login",
    authController.verifyUser.bind(
      authController
    ) as AuthControllerInterface["verifyUser"]
  );
}

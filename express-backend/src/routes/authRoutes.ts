import { Router, Express, Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/authController";
import { expressjwt, GetVerificationKey } from "express-jwt";

const router = Router();
const authController = new AuthController();
const SECRET_KEY = "your_secret_key"; // 請使用更安全的密鑰

// JWT 驗證中間件
const authenticate = expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] });

// 角色驗證中間件
const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.auth.role;
    if (!roles.includes(userRole)) {
      return res.status(403).send({ success: false, message: "Forbidden" });
    }
    next();
  };
};

export function setAuthRoutes(app: Express) {
  // 處理用戶登錄請求
  router.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("verifyUser has sent response");
      console.log("We try to enter login");
      authController.login(req, res, next);
    }
  );

  router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
    authController.signup(req, res, next);
  });

  // 保護 /event-info 路由，只有 normal 用戶可以訪問
  router.get(
    "/event-info",
    authenticate as any,
    authorize(["normal"]),
    (req: Request, res: Response) => {
      res.send("This is the event info page.");
    }
  );

  // 保護 /admin-manage 路由，只有 admin 用戶可以訪問
  router.get(
    "/admin-manage",
    authenticate as any,
    authorize(["admin"]),
    (req: Request, res: Response) => {
      res.send("This is the admin manage page.");
    }
  );

  app.use("/api/auth", router);
}

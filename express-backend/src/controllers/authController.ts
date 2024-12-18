import { Request, Response, NextFunction } from "express";
import { users } from "../data/Users"; // Correctly import the users arr
import { User, IUser } from "../models/User";
import * as fs from "fs";
import path from "path";
const usersFilePath = path.join(__dirname, "../data/Users.ts");
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const user: IUser | null = await User.findOne({ email, password });

      console.log("There is before check user");

      if (user) {
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role }, // 包含角色信息
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        const userObject = {
          role: user.role,
          userId: user._id,
        };

        console.log("Generated Token:", token); // 打印生成的 JWT
        console.log("User role:", user.role); // 打印用戶角色
        res.status(200).send({
          success: true,
          message: "Login successful",
          token,
          userObject,
          redirectUrl:
            user.role === "admin"
              ? "http://localhost:3000/admin"
              : "http://localhost:3000/event-info", // 根據角色設置重定向 URL
        });
      } else {
        res
          .status(401)
          .send({ success: false, message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, email, password, role = "normal" } = req.body;

    try {
      // 檢查是否已經存在相同的 email 或 username
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        res.status(400).send({
          success: false,
          message: "Email or username already in use",
        });
        return;
      }

      // 創建新用戶並保存到 MongoDB
      const newUser: IUser = new User({ username, email, password, role });
      await newUser.save();

      // 更新本地文件
      users.push({ username, email, password, favouriteVenues: [], role });
      const fileContent = `export const users = ${JSON.stringify(
        users,
        null,
        2
      )};`;
      fs.writeFileSync(usersFilePath, fileContent);

      res.status(201).send({
        success: true,
        message: "Signup successful",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "An error occurred. Please try again.",
      });
      next(error);
    }
  }

  async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;

    try {
      // 從 MongoDB 中查找匹配的用戶
      const existingUser: IUser | null = await User.findOne({ email });

      console.log("There is verifyUser");

      if (existingUser) {
        console.log("user exists");
        res.status(200).send({
          success: true,
          message: "User exists",
        });
      } else {
        console.log("user not exists");
        res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
      next(error);
    }
  }
}

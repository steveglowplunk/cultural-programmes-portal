import { Request, Response, NextFunction } from "express";
import { fakeUsers } from "../data/fakeUsers"; // this is fake data to modify database
import * as fs from "fs";
import path from "path";
const fakeUsersFilePath = path.join(__dirname, "../data/fakeUsers.ts");

export class AuthController {
  // private fakeUsers = [
  //   { email: "test@example.com", password: "password123" },
  //   { email: "user@example.com", password: "mypassword" },
  // ];

  verifyUser(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;

    // 打印用戶傳輸進來的 email 和 password
    console.log("Received email:", email);
    console.log("Received password:", password);

    // 查找假用戶數據中是否存在匹配的用戶
    const user = fakeUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // 如果找到匹配的用戶，返回成功消息
      res.status(200).send({
        success: true,
        message: "Login successful",
        redirectUrl: "http://localhost:3000/event-info",
      });
    } else {
      // 如果沒有找到匹配的用戶，返回錯誤消息
      res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    }
  }

  signup(req: Request, res: Response, next: NextFunction): void {
    const { username, email, password } = req.body; // 確保從請求體中提取 username

    // 檢查是否已經存在相同的 email
    const existingUser = fakeUsers.find((user) => user.email === email);
    if (existingUser) {
      res.status(400).send({
        success: false,
        message: "Email already in use",
      });
      return; // 確保方法結束
    }

    // 添加新用戶到假用戶數據
    fakeUsers.push({ username, email, password });
    console.log("New user added:", { username, email, password });

    // 將更新後的假用戶數據保存到文件中
    const fileContent = `export const fakeUsers = ${JSON.stringify(
      fakeUsers,
      null,
      2
    )};`;
    fs.writeFileSync(fakeUsersFilePath, fileContent);

    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  }
}

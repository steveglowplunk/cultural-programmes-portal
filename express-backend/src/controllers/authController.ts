import { Request, Response, NextFunction } from "express";

export class AuthController {
  private fakeUsers = [
    { email: "test@example.com", password: "password123" },
    { email: "user@example.com", password: "mypassword" },
  ];

  verifyUser(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.query;

    // 打印用戶傳輸進來的 email 和 password
    console.log("Received email:", email);
    console.log("Received password:", password);

    // 查找假用戶數據中是否存在匹配的用戶
    const user = this.fakeUsers.find(
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
}

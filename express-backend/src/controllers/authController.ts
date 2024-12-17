import { Request, Response, NextFunction } from "express";
import { users } from "../data/Users"; // Correctly import the users array
import { User } from "../models/User"; // Import the User model
import * as fs from "fs";
import path from "path";
import mongoose from "mongoose";
const usersFilePath = path.join(__dirname, "../data/Users.ts");

export class AuthController {
  login(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;

    // Find the user with the matching email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // If a matching user is found, return a success message
      res.status(200).send({
        success: true,
        message: "Login successful",
        redirectUrl: "http://localhost:3000/event-info",
      });
    } else {
      // If no matching user is found, return an error message
      res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    }
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, email, password } = req.body; // Ensure username is extracted from the request body

    try {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).send({
          success: false,
          message: "Email already in use",
        });
        return; // Ensure the method ends here
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(201).send({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: "Internal server error" });
    }
  }
  verifyUser(req: Request, res: Response, next: NextFunction): void {
    const { email } = req.body;

    // Check if a user with the same email exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.status(200).send({
        success: true,
        message: "User exists",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  }
}

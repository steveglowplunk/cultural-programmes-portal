import { Request, Response } from "express";
import { User } from "../models/User";
import { Event } from "../models/Event";
import { Location } from "../models/Location";
import fs from "fs";
import path from "path";
const usersFilePath = path.join(__dirname, "../data/Users.ts");
import { Types } from 'mongoose';

export class AdminController {
  // User CRUD operations
  async createUser(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      await user.save();

      // 確定 Users.ts 文件的路徑
      const usersFilePath = path.join(__dirname, "../data/Users.ts");
      console.log("Users file path:", usersFilePath);

      // 讀取 Users.ts 文件的內容
      const usersFileContent = fs.readFileSync(usersFilePath, "utf-8");

      // 提取數據
      const start =
        usersFileContent.indexOf("export const users = ") +
        "export const users = ".length;
      const end = usersFileContent.lastIndexOf(";");
      const usersDataString = usersFileContent.substring(start, end).trim();
      const usersData = JSON.parse(usersDataString);

      // 添加新用戶
      usersData.push(req.body);

      // 將更新後的數據寫回 Users.ts 文件
      const updatedUsersFileContent = `export const users = ${JSON.stringify(
        usersData,
        null,
        2
      )};`;
      fs.writeFileSync(usersFilePath, updatedUsersFileContent);
      console.log("Users file updated successfully");

      res.status(201).send(user);
    } catch (error) {
      console.error("Error updating Users.ts file:", error);
      res.status(400).send(error);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getUserByName(req: Request, res: Response) {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // async updateUser(req: Request, res: Response) {
  //   try {
  //     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //       new: true,
  //       runValidators: true,
  //     });
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     res.status(200).send(user);
  //   } catch (error) {
  //     res.status(400).send(error);
  //   }
  // }

  async deleteUser(req: Request, res: Response) {
    try {
      // 刪除 MongoDB 中的數據
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send();
      }

      // 確定 Users.ts 文件的路徑
      const usersFilePath = path.join(__dirname, "../data/Users.ts");
      console.log("Users file path:", usersFilePath);

      // 讀取 Users.ts 文件的內容
      const usersFileContent = fs.readFileSync(usersFilePath, "utf-8");

      // 提取數據
      const start =
        usersFileContent.indexOf("export const users = ") +
        "export const users = ".length;
      const end = usersFileContent.lastIndexOf(";");
      const usersDataString = usersFileContent.substring(start, end).trim();
      const usersData = JSON.parse(usersDataString);

      // 刪除相應的用戶
      const updatedUsersData = usersData.filter(
        (u: any) => u.username !== user.username
      );

      // 將更新後的數據寫回 Users.ts 文件
      const updatedUsersFileContent = `export const users = ${JSON.stringify(
        updatedUsersData,
        null,
        2
      )};`;
      fs.writeFileSync(usersFilePath, updatedUsersFileContent);
      console.log("Users file updated successfully");

      res.status(200).send(user);
    } catch (error) {
      console.error("Error updating Users.ts file:", error);
      res.status(500).send(error);
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const newEvent = new Event(req.body);
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error });
    }
  }

  async getEvents(req: Request, res: Response) {
    try {
      const events = await Event.find();
      res.status(200).send(events);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).send();
      }
      res.status(200).send(event);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!event) {
        return res.status(404).send();
      }
      res.status(200).send(event);
    } catch (error) {
      res.status(400).send(error);
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const user = await User.findOneAndUpdate(
        { username: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) {
        return res.status(404).send();
      }

      // 確定 Users.ts 文件的路徑
      const usersFilePath = path.join(__dirname, "../data/Users.ts");
      console.log("Users file path:", usersFilePath);

      // 讀取 Users.ts 文件的內容
      const usersFileContent = fs.readFileSync(usersFilePath, "utf-8");

      // 提取數據
      const start =
        usersFileContent.indexOf("export const users = ") +
        "export const users = ".length;
      const end = usersFileContent.lastIndexOf(";");
      const usersDataString = usersFileContent.substring(start, end).trim();
      const usersData = JSON.parse(usersDataString);

      // 更新相應的用戶
      const updatedUsersData = usersData.map((u: any) =>
        u.username === user.username ? { ...u, ...req.body } : u
      );

      // 將更新後的數據寫回 Users.ts 文件
      const updatedUsersFileContent = `export const users = ${JSON.stringify(
        updatedUsersData,
        null,
        2
      )};`;
      fs.writeFileSync(usersFilePath, updatedUsersFileContent);
      console.log("Users file updated successfully");

      res.status(200).send(user);
    } catch (error) {
      console.error("Error updating Users.ts file:", error);
      res.status(400).send(error);
    }
  }
  async deleteEvent(req: Request, res: Response) {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        return res.status(404).send();
      }
      res.status(200).send(event);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Location CRUD operations
  async createLocation(req: Request, res: Response) {
    try {
      const location = new Location(req.body);
      await location.save();
      res.status(201).send(location);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getLocations(req: Request, res: Response) {
    try {
      const locations = await Location.find();
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getLocationById(req: Request, res: Response) {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).send();
      }
      res.status(200).send(location);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateLocation(req: Request, res: Response) {
    try {
      const location = await Location.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!location) {
        return res.status(404).send();
      }
      res.status(200).send(location);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteLocation(req: Request, res: Response) {
    try {
      const location = await Location.findByIdAndDelete(req.params.id);
      if (!location) {
        return res.status(404).send();
      }
      res.status(200).send(location);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
export default new AdminController();

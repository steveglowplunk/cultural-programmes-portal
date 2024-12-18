import express from "express";
import { AdminController } from "../controllers/adminController";
import { asyncHandler } from "../controllers/asyncHandler";
const router = express.Router();
const adminController = new AdminController();

// User routes
router.post("/users", asyncHandler(adminController.createUser));
router.get("/users", asyncHandler(adminController.getUsers));
router.get("/users/:id", asyncHandler(adminController.getUserById));
router.put("/users/:id", asyncHandler(adminController.updateUser));
router.delete("/users/:id", asyncHandler(adminController.deleteUser));

// Event routes
router.post("/events", asyncHandler(adminController.createEvent));
router.get("/events", asyncHandler(adminController.getEvents));
router.get("/events/:id", asyncHandler(adminController.getEventById));
router.put("/events/:id", asyncHandler(adminController.updateEvent));
router.delete("/events/:id", asyncHandler(adminController.deleteEvent));

// Location routes
router.post("/locations", asyncHandler(adminController.createLocation));
router.get("/locations", asyncHandler(adminController.getLocations));
router.get("/locations/:id", asyncHandler(adminController.getLocationById));
router.put("/locations/:id", asyncHandler(adminController.updateLocation));
router.delete("/locations/:id", asyncHandler(adminController.deleteLocation));

export const setAdminRoutes = (app: express.Application) => {
  app.use("/admin", router);
};

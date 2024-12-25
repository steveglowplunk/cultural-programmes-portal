import express from "express";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../controllers/asyncHandler";

const router = express.Router();
const userController = new UserController();

router.get("/event/:id", asyncHandler(userController.getEvent)); //worked
router.get(
  "/event/venue/:venueId",
  asyncHandler(userController.getEventByVenueId)
); // search the event by venue ID (work)
router.get(
  "/event-categories",
  asyncHandler(userController.getAllEventCategories)
); // get all categories (work)
router.get(
  "/locations/distance",
  asyncHandler(userController.filterLocationWithDistance)
); // get location by distance (work)
router.get(
  "/locations/category",
  asyncHandler(userController.filterLocationsByEventCategory)
); // use category to filter location (work)
router.get(
  "/locations/search",
  asyncHandler(userController.searchLocationByKeyword)
); // search location by keyword (work)
// router.get(
//   "/locations/top10",
//   asyncHandler(userController.fetch10LocationsWith3Events)
// );
router.get(
  "/locations/more-than-3-events",
  asyncHandler(userController.fetchLocationsWithEvents)
); // user login, this will show first (work)
router.get(
  "/locations/more-than-3-events-asc",
  asyncHandler(userController.fetchLocationsWithEventsAsc)
); // show event by ascending order (work)
router.get(
  "/locations/more-than-3-events-desc",
  asyncHandler(userController.fetchLocationsWithEventsDesc)
); // show event by descending order (work)
router.post(
  "/users/:username/favourite-venues",
  asyncHandler(userController.updateUserFavouriteVenues)
); // add favourite venue by ID (to be tested)
router.get(
  "/users/:username/favourite-venues",
  asyncHandler(userController.getFavouriteVenues)
); // get favourite venue by ID (work)

export const setUserRoutes = (app: express.Application) => {
  app.use("/api", router);
};

import express from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../controllers/asyncHandler';

const router = express.Router();
const userController = new UserController();

router.get('/event/:id', asyncHandler(userController.getEvent));//worked
router.get('/event/venue/:venueId', asyncHandler(userController.getEventByVenueId));//worked
router.get('/event-categories', asyncHandler(userController.getAllEventCategories));//worked
router.get('/locations/distance', asyncHandler(userController.filterLocationWithDistance));
router.get('/locations/category', asyncHandler(userController.filterLocationsByEventCategory));
router.get('/locations/search', asyncHandler(userController.searchLocationByKeyword));//worked
router.get('/locations/more-than-3-events', asyncHandler(userController.fetchLocationsWithEvents));//work
router.get('/locations/more-than-3-events-asc', asyncHandler(userController.fetchLocationsWithEventsAsc));//work
router.get('/locations/more-than-3-events-desc', asyncHandler(userController.fetchLocationsWithEventsDesc));//work
router.post('/users/:username/favourite-venues', asyncHandler(userController.updateUserFavouriteVenues));
router.get('/users/:username/favourite-venues', asyncHandler(userController.getFavouriteVenues));//work
export const setUserRoutes = (app: express.Application) => {
  app.use('/api', router);
};
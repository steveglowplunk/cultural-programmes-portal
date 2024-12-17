import express from 'express';
import { UserController } from '../controllers/userController';
import { asyncHandler } from '../controllers/asyncHandler';

const router = express.Router();
const userController = new UserController();

router.get('/event/:id', asyncHandler(userController.getEvent));
router.get('/event/venue/:venueId', asyncHandler(userController.getEventByVenueId));
router.get('/event-categories', asyncHandler(userController.getAllEventCategories));
router.get('/locations/distance', asyncHandler(userController.filterLocationWithDistance));
router.get('/locations/category', asyncHandler(userController.filterLocationsByEventCategory));
router.get('/locations/search', asyncHandler(userController.searchLocationByKeyword));
router.get('/locations/top10', asyncHandler(userController.fetch10UniqueLocationsWith3Events));
router.get('/locations/more-than-3-events-asc', asyncHandler(userController.fetchLocationsWithEventsAsc));
router.get('/locations/more-than-3-events-desc', asyncHandler(userController.fetchLocationsWithEventsDesc));
router.post('/users/:username/favourite-venues', userController.updateUserFavouriteVenues);


export const setUserRoutes = (app: express.Application) => {
  app.use('/api', router);
};
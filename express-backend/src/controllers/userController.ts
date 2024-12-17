import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Location } from '../models/Location';

export class UserController {
  async getEvent(req: Request, res: Response) {
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

  async getEventByVenueId(req: Request, res: Response) {
    try {
      const event = await Event.find({ venueId: req.params.venueId });
      if (!event) {
        return res.status(404).send();
      }
      res.status(200).send(event);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getAllEventCategories(req: Request, res: Response) {
    try {
      const categories = await Event.distinct('category');
      res.status(200).send(categories);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async filterLocationWithDistance(req: Request, res: Response) {
    const { latitude, longitude, distance } = req.query;
    try {
      const locations = await Location.find({
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(longitude as string), parseFloat(latitude as string)],
              parseFloat(distance as string) / 3963.2,
            ],
          },
        },
      });
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async filterLocationsByEventCategory(req: Request, res: Response) {
    const { category } = req.query;
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events',
          },
        },
        {
          $match: {
            'events.cat1': category,
          },
        },
      ]);

      console.log('Filtered Locations:', locations); // Log the result

      res.status(200).send(locations);
    } catch (error) {
      console.error('Error:', error); // Log the error
      res.status(500).send(error);
    }
  }

  async searchLocationByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    try {
      const locations = await Location.find({
        $text: { $search: keyword as string },
      });
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async fetch10LocationsWith3Events(req: Request, res: Response) {
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events',
          },
        },
        {
          $project: {
            venueId: 1,
            venueName: 1,
            latitude: 1,
            longitude: 1,
            eventCount: { $size: '$events' },
          },
        },
        {
          $match: {
            eventCount: { $gte: 3 },
          },
        },
        {
          $limit: 10,
        },
      ]);
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async listLocationsWithMoreThan3EventsAscendingOrder(req: Request, res: Response) {
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events',
          },
        },
        {
          $project: {
            venueId: 1,
            venueName: 1,
            latitude: 1,
            longitude: 1,
            eventCount: { $size: '$events' },
          },
        },
        {
          $match: {
            eventCount: { $gt: 3 },
          },
        },
        {
          $sort: { eventCount: 1 },
        },
      ]);
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async listLocationsWithMoreThan3EventsDescendingOrder(req: Request, res: Response) {
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events',
          },
        },
        {
          $project: {
            venueId: 1,
            venueName: 1,
            latitude: 1,
            longitude: 1,
            eventCount: { $size: '$events' },
          },
        },
        {
          $match: {
            eventCount: { $gt: 3 },
          },
        },
        {
          $sort: { eventCount: -1 },
        },
      ]);
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
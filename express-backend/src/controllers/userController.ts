import path from "path";
import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { User } from "../models/User";
import { users } from "../data/Users";
import { Location } from '../models/Location';
import { eventNames } from 'process';
import fs from 'fs';

const usersFilePath = path.join(__dirname, 'data', 'Users.ts');

export class UserController {
  async getEvent(req: Request, res: Response) {
    try {
      const event = await Event.find({eventId:req.params.id});
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
      const categories = await Event.distinct('cat2');
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
            as: 'events'
          }
        },
        {
          $match: {
            'events.cat2': category
          }
        },
        {
          $project: {
            _id: 0,
            venueId: 1,
            venueName: 1,
            cat1: 1,
            events: 1
          }
        }
      ]);
      console.log('Locations with events in category:', category, locations);
      res.status(200).send(locations);
    } catch (err) {
      console.error('Error filtering locations by event category:', err);
      res.status(500).send(err);
    }
  }

  async searchLocationByKeyword(req: Request, res: Response) {
    const { keyword } = req.query;
    try {
      const locations = await Location.find({
        venueName: { $regex: keyword as string, $options: 'i' }
      });
      console.log('Locations matching keyword:', locations);
      res.status(200).send(locations);
    } catch (error) {
      console.error('Error searching locations by keyword:', error);
      res.status(500).send(error);
    }
  }

  async fetchLocationsWithEvents(req: Request, res: Response) {
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events'
          }
        },
        {
          $match: {
            'events.3': { $exists: true },
            latitude: { $ne: '' },
            longitude: { $ne: '' }
          }
        },
        {
          $group: {
            _id: { latitude: "$latitude", longitude: "$longitude" },
            venueId: { $first: "$venueId" },
            venueName: { $first: "$venueName" },
            latitude: { $first: "$latitude" },
            longitude: { $first: "$longitude" },
            events: { $first: "$events" }
          }
        },
        {
          $project: {
            venueId: 1,
            venueName: 1,
            latitude: 1,
            longitude: 1,
            eventsCount: { $size: "$events" }
          }
        },
        { $limit: 10 }
      ]);
      console.log('Locations with events in ascending order:', locations);
      res.status(200).send(locations);
    } catch (err) {
      console.error('Error fetching locations:', err);
      res.status(500).send(err);
    }
  }
  async fetchLocationsWithEventsAsc(req: Request, res: Response) {
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events'
          }
        },
        {
          $match: {
            'events.3': { $exists: true },
            latitude: { $ne: '' },
            longitude: { $ne: '' }
          }
        },
        {
          $group: {
            _id: { latitude: "$latitude", longitude: "$longitude" },
            venueId: { $first: "$venueId" },
            venueName: { $first: "$venueName" },
            latitude: { $first: "$latitude" },
            longitude: { $first: "$longitude" },
            events: { $first: "$events" }
          }
        },
        {
          $project: {
            venueId: 1,
            venueName: 1,
            latitude: 1,
            longitude: 1,
            eventsCount: { $size: "$events" }
          }
        },
        { $sort: { eventsCount: 1 } },
        { $limit: 10 }
      ]);
      console.log('Locations with events in ascending order:', locations);
      res.status(200).send(locations);
    } catch (err) {
      console.error('Error fetching locations:', err);
      res.status(500).send(err);
    }
  }

  async fetchLocationsWithEventsDesc(req: Request, res: Response) {
    try {
      const locations = await Location.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'venueId',
            foreignField: 'venueId',
            as: 'events'
          }
        },
        {
          $match: {
            'events.3': { $exists: true },
            latitude: { $ne: '' },
            longitude: { $ne: '' }
          }
        },
        {
          $group: {
            _id: { latitude: "$latitude", longitude: "$longitude" },
            venueId: { $first: "$venueId" },
            venueName: { $first: "$venueName" },
            latitude: { $first: "$latitude" },
            longitude: { $first: "$longitude" },
            events: { $first: "$events" }
          }
        },
        {
          $project: {
            venueId: 1,
            venueName: 1,
            latitude: 1,
            longitude: 1,
            eventsCount: { $size: "$events" }
          }
        },
        { $sort: { eventsCount: -1 } },
        { $limit: 10 }
      ]);
      console.log('Locations with events in descending order:', locations);
      res.status(200).send(locations);
    } catch (err) {
      console.error('Error fetching locations:', err);
      res.status(500).send(err);
    }
  }

  async updateUserFavouriteVenues(req: Request, res: Response) {
    const { username } = req.params;
    const { venueId } = req.body;

    try {
      // Check if the user exists
      const userExists = await User.findOne({ username: username });
      if (!userExists) {
        console.log(`User with username ${username} does not exist`);
        return res.status(404).send({ success: false, message: 'User not found' });
      }

      // Check if the venueId is already in favouriteVenues
      if (userExists.favouriteVenues.includes(venueId)) {
        console.log(`VenueId ${venueId} is already in the favouriteVenues array for user ${username}`);
        return res.status(400).send({ success: false, message: 'Venue already in favourite venues' });
      }

      const result = await User.updateOne(
        { username: username },
        { $addToSet: { favouriteVenues: venueId } }
      );

      if (result.modifiedCount === 0) {
        console.log('User not found or favouriteVenues not updated');
        return res.status(500).send({ success: false, message: 'User not found or favouriteVenues not updated' });
      } else {
        console.log('User favouriteVenues updated successfully');

        // Fetch the updated user data
        const updatedUser = await User.findOne({ username: username });
        if (updatedUser) {
          // Find the index of the user in the users array
          const userIndex = users.findIndex(user => user.username === username);
          console.log('User index:', userIndex);
          if (userIndex !== -1) {
            // Update the user's favouriteVenues in the users array
            users[userIndex].favouriteVenues.push(venueId); // Ensure favouriteVenues is an array of strings
            // Write the updated user data to the file
            fs.writeFileSync(usersFilePath, `export const users = ${JSON.stringify(users, null, 2)};`);
            console.log('Updated user data written to file');
          }
        }
        return res.status(200).send({ success: true, message: 'User favouriteVenues updated successfully' });
      }
    } catch (err) {
      console.error('Error updating user favourite venues:', err);
      return res.status(500).send({ success: false, message: 'Internal server error' });
    }
  }
  async getFavouriteVenues(req: Request, res: Response) {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username: username });
      if (user) {
        console.log('Favourite venues for user', username, ':', user.favouriteVenues);
        res.status(200).send(user.favouriteVenues);
      } else {
        console.log('User not found');
        res.status(404).send({ success: false, message: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching favourite venues:', err);
      res.status(500).send({ success: false, message: 'Internal server error' });
    }
  }
  // async likeEvent(req: Request, res: Response) {
  //   const { eventId } = req.body;
  //   try {
  //     const event = await Event.findById(eventId);
  //     if (!event) {
  //       return res.status(404).send('Event not found');
  //     }

  //     event.likeCount += 1;
  //     await event.save();

  //     res.status(200).send('Event liked successfully');
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // }
}
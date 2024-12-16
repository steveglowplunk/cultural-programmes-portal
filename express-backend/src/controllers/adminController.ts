import { Request, Response } from 'express';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Location } from '../models/Location';

export class AdminController {
  // User CRUD operations
  async createUser(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
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

  async updateUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // Event CRUD operations
  async createEvent(req: Request, res: Response) {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).send(event);
    } catch (error) {
      res.status(400).send(error);
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
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!event) {
        return res.status(404).send();
      }
      res.status(200).send(event);
    } catch (error) {
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
      const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
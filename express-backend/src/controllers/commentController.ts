import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Location } from '../models/Location';
import { User } from '../models/User';

export const createComment = async (req: Request, res: Response) => {
    try {
        const { userId, locationId, text } = req.body;
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).send('Location not found');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const comment = new Comment({
            user: userId,
            location: locationId,
            text,
        });

        await comment.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getCommentsByLocation = async (req: Request, res: Response) => {
    try {
        const { locationId } = req.params;
        const comments = await Comment.find({ location: locationId }).populate('user', 'username');
        res.status(200).send(comments);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        res.status(200).send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
};
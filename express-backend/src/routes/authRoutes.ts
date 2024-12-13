import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = Router();
const authController = new AuthController();

export function setAuthRoutes(app) {
    app.use('/api/auth', router);
    router.post('/login', authController.verifyUser.bind(authController));
}
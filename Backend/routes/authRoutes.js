import express from 'express';
import { registerUser, loginUser } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';
import getUserData from '../controller/userController.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/user/data', userAuth, getUserData);
export default authRouter;
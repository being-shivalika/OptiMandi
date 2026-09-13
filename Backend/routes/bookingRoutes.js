import express from 'express';
import { requestSlot, getMySlots, getAllSlots, updateSlotStatus } from '../controller/bookingController.js';
import userAuth from '../middleware/userAuth.js';

const bookingRouter = express.Router();

bookingRouter.post('/request', userAuth, requestSlot);
bookingRouter.get('/my-slots', userAuth, getMySlots);
bookingRouter.get('/all', userAuth, getAllSlots);
bookingRouter.put('/update/:id', userAuth, updateSlotStatus);

export default bookingRouter;

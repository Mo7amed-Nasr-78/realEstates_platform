import express from 'express';
const router = express.Router();
import validateToken from '../middlewares/validateTokenHandle.js';
import { getOwnBookings, getAllBookings, getReceivedBookings,createBooking, updateBooking, deleteBooking } from '../controllers/Booking.js';

router.route('/delete/:id').delete(validateToken, deleteBooking);

router.route('/update/:id').post(validateToken, updateBooking);

router.route('/create').post(validateToken, createBooking);

router.route('/getAll').get(validateToken, getAllBookings);

router.route('/get').get(validateToken, getOwnBookings);

router.route('/receive').get(validateToken, getReceivedBookings);

export default router;
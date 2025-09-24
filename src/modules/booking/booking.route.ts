import { Router } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import validateRequest from '@src/middlewares/validateRequest';
import { createServiceRequestValidationSchema, updateServiceRequestValidationSchema } from './booking.validation';
import * as bookingController from './booking.controller';

const router = Router();

/**
 * @route   POST /api/booking/create
 * @desc    Create a new service request
 * @access  Protected
 */
router.post(
    '/create',
    authMiddleware,
    validateRequest(createServiceRequestValidationSchema),
    bookingController.createServiceRequest
);

/**
 * @route   GET /api/booking/all
 * @desc    Get all service requests
 * @access  Protected
 */
router.get('/all', authMiddleware, bookingController.getAllServiceRequests);

/**
 * @route   GET /api/booking/:id
 * @desc    Get service request by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, bookingController.getServiceRequestById);

/**
 * @route   PATCH /api/booking/:id
 * @desc    Update a service request
 * @access  Protected
 */
router.patch(
    '/:id',
    authMiddleware,
    validateRequest(updateServiceRequestValidationSchema),
    bookingController.updateServiceRequest
);

/**
 * @route   DELETE /api/booking/:id
 * @desc    Delete a service request
 * @access  Protected
 */
router.delete('/:id', authMiddleware, bookingController.deleteServiceRequest);

/**
 * @route   GET /api/booking/user/:userId
 * @desc    Get all service requests by a specific user
 * @access  Protected
 */
router.get('/user/:userId', authMiddleware, bookingController.getServiceRequestsByUserId);

// Get request by service provider ID can be added similarly
router.get('/provider/:providerId', authMiddleware, bookingController.getServiceRequestsByProviderId);

const bookingRoute = router;

export default bookingRoute;

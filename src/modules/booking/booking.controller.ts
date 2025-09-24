import { HttpStatus } from '@src/constants/httpStatus';
import { catchAsync } from '@src/utils/catchAsync';
import { sendSuccess } from '@src/utils/sendResponse';
import { Request, Response } from 'express';
import * as booking from './booking.service';
import { ApiError } from '@src/utils/ApiError';


/**
 * Create a new service request
 */
export const createServiceRequest = catchAsync(async (req: Request, res: Response) => {
 
  const serviceRequest = await booking.createServiceRequest(req.body);
  sendSuccess(res, 'Service Request created successfully', HttpStatus.CREATED, serviceRequest);
});

/**
 * Update a service request
 */
export const updateServiceRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedRequest = await booking.updateServiceRequest(Number(id), payload);
    sendSuccess(res, 'Service request updated successfully', HttpStatus.OK, updatedRequest);
});

/**
 * Delete a service request
 */
export const deleteServiceRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await booking.deleteServiceRequest(Number(id));
    sendSuccess(res, 'Service request deleted successfully', HttpStatus.OK, null);
});

/**
 * Get all service requests
 */
export const getAllServiceRequests = catchAsync(async (_req: Request, res: Response) => {
    const requests = await booking.getAllServiceRequests();
    sendSuccess(res, 'Service requests fetched successfully', HttpStatus.OK, requests);
});

/**
 * Get service request by ID
 */
export const getServiceRequestById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const request = await booking.getServiceRequestById(Number(id));
    sendSuccess(res, 'Service request fetched successfully', HttpStatus.OK, request);
});

/**
 * Get all service requests by user ID
 */
export const getServiceRequestsByUserId = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const requests = await booking.getServiceRequestsByUserId(Number(userId));
    sendSuccess(res, `Service requests for user ${userId} fetched successfully`, HttpStatus.OK, requests);
});

//getServiceRequestsByProviderId

export const getServiceRequestsByProviderId = catchAsync(async (req: Request, res: Response) => {
    const { providerId } = req.params;
    const requests = await booking.getServiceRequestsByProviderId(Number(providerId));
    sendSuccess(res, `Service requests for provider ${providerId} fetched successfully`, HttpStatus.OK, requests);
});

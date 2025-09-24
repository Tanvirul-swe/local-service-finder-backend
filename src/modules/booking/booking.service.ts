import { HttpStatus } from "@src/constants/httpStatus";
import db from "@src/database/models";
import { TCreateServiceRequestInput, TUpdateServiceRequestInput } from "@src/database/models/service_request.model";
import { ApiError } from "@src/utils/ApiError";


export const createServiceRequest = async (payload: TCreateServiceRequestInput) => {
    // Check user exists
        console.log('Creating service request with payload:', payload);

    const user = await db.User.findByPk(payload.userId);
    if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

    // Check service provider exists
    const provider = await db.User.findByPk(payload.serviceProviderId);
    if (!provider) throw new ApiError('Service provider not found', HttpStatus.NOT_FOUND);

    // Log to see the request payload

    // Create service request
    const serviceRequest = await db.ServiceRequest.create(payload);

    return serviceRequest;
};

export const updateServiceRequest = async (id: number, payload: TUpdateServiceRequestInput) => {
    const request = await db.ServiceRequest.findByPk(id);
    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);

    await request.update(payload);
    return request;
};

export const deleteServiceRequest = async (id: number) => {
    const request = await db.ServiceRequest.findByPk(id);
    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);

    await request.destroy();
};

export const getAllServiceRequests = async () => {
    return db.ServiceRequest.findAll();
};

export const getServiceRequestById = async (id: number) => {
    const request = await db.ServiceRequest.findByPk(id);
    if (!request) throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);
    return request;
};

export const getServiceRequestsByUserId = async (userId: number) => {
    return db.ServiceRequest.findAll({ where: { userId } });
};

//getServiceRequestsByProviderId

export const getServiceRequestsByProviderId = async (providerId: number) => {
    return db.ServiceRequest.findAll({ where: { serviceProviderId: providerId } });
}
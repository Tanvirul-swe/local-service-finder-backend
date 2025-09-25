import { HttpStatus } from "@src/constants/httpStatus";
import db from "@src/database/models";
import { TCreateRequestModificationInput, TUpdateRequestModificationInput } from "@src/database/models/request_modification.model";
import { TCreateServiceRequestInput, TUpdateServiceRequestInput } from "@src/database/models/service_request.model";
import { ApiError } from "@src/utils/ApiError";


export const createServiceRequest = async (payload: TCreateServiceRequestInput) => {
    try {
        console.log('Creating service request with payload:', payload);

        // Check user exists
        const user = await db.User.findByPk(payload.userId);
        if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

        // Check provider exists
        const provider = await db.User.findByPk(payload.serviceProviderId);
        if (!provider) throw new ApiError('Service provider not found', HttpStatus.NOT_FOUND);

        // Check package exists
        const pkg = await db.Package.findByPk(payload.packageId);
        if (!pkg) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);

        // Create
        const serviceRequest = await db.ServiceRequest.create(payload);
        return serviceRequest;
    } catch (error: any) {
        console.error('Error creating service request:', error.message);
        console.error('Full error:', error); // will show MySQL constraint issues
        throw new ApiError('Failed to create service request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    return db.ServiceRequest.findAll({
        include: [
            {
                model: db.RequestModification,
                as: 'modifications',
            },
        ],
    });
};
export const getServiceRequestById = async (id: number) => {
    const request = await db.ServiceRequest.findByPk(id, {
        include: [
            {
                model: db.RequestModification,
                as: 'modifications',
            },
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            },
            {
                model: db.User,
                as: 'serviceProvider',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            },
            {
                model: db.Package,
                as: 'package',
                // attributes: ['id', 'name', 'price'],
            },
        ],
    });

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

// ===========Service Modification===========

export const createRequestModification = async (
    serviceRequestId: number,
    payload: TCreateRequestModificationInput
) => {
    const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId);
    if (!serviceRequest) {
        throw new ApiError('Service request not found', HttpStatus.NOT_FOUND);
    }

    const insertPayload = {
        ...payload,
        serviceRequestId,
        status: 'PENDING',
    };

    console.log("📦 Insert payload for modification:", insertPayload);

    return db.RequestModification.create(insertPayload);
};

export const getRequestModifications = async (serviceRequestId: number) => {
    return db.RequestModification.findAll({
        where: { serviceRequestId },
        include: [{ model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }],
    });
};

export const updateRequestModification = async (id: number, payload: TUpdateRequestModificationInput) => {
    const modification = await db.RequestModification.findByPk(id);
    if (!modification) throw new ApiError('Modification not found', HttpStatus.NOT_FOUND);

    await modification.update(payload);
    return modification;
};

export const deleteRequestModification = async (id: number) => {
    const modification = await db.RequestModification.findByPk(id);
    if (!modification) throw new ApiError('Modification not found', HttpStatus.NOT_FOUND);

    await modification.destroy();
    return true;
};

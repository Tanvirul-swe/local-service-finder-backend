// service.controller.ts
import { Request, Response } from 'express';
import { HttpStatus } from '@src/constants/httpStatus';
import { ApiError } from '@src/utils/ApiError';
import { catchAsync } from '@src/utils/catchAsync';
import { sendSuccess } from '@src/utils/sendResponse';
import logger from '@src/utils/logger';
import * as serviceService from './service.service';
import db from '@src/database/models';
import { TCreatePackageInput, TUpdatePackageInput } from '@src/database/models/package.model';

/**
 * Create a new category
 */
export const createCategory = catchAsync(async (req: Request, res: Response) => {
    const { name, icon } = req.body;

    const category = await serviceService.createCategory({ name, icon });
    sendSuccess(res, 'Category created successfully', HttpStatus.CREATED, category);
});

/**
 * Update an existing category
 */
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = Number(req.params.id);
    const { name, icon } = req.body;

    const category = await serviceService.updateCategory(categoryId, { name, icon });
    sendSuccess(res, 'Category updated successfully', HttpStatus.OK, category);
});

/**
 * Get all categories
 */
export const getCategories = catchAsync(async (_req: Request, res: Response) => {
    const categories = await serviceService.getAllCategories();
    sendSuccess(res, 'Categories fetched successfully', HttpStatus.OK, categories);
});

/**
 * Get a single category by ID
 */
export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const categoryId = Number(req.params.id);
    const category = await serviceService.getCategoryById(categoryId);

    if (!category) {
        throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
    }

    sendSuccess(res, 'Category fetched successfully', HttpStatus.OK, category);
});

/**
 * Delete a category
 */
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId = Number(req.params.id);
    await serviceService.deleteCategory(categoryId);
    sendSuccess(res, 'Category deleted successfully', HttpStatus.OK);
});



///================Package Controllers=================
/**
 * Create a new package with validations:
 * 1. No other package with same name for the user
 * 2. No other package with same price for the user
 * 3. Maximum 5 packages per user
 */
export const createPackage = async (data: TCreatePackageInput) => {
    const { name, price, userId } = data;
    
    logger.info(`Creating package for user ID: ${userId} with name: ${name} and price: ${price}`);
    // Check user exists
    const user = await db.User.findByPk(userId);
    if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

    // Check package count
    const packageCount = await db.Package.count({ where: { userId } });
    if (packageCount >= 5) {
        throw new ApiError('Maximum 5 packages allowed per user', HttpStatus.BAD_REQUEST);
    }

    // Check for same package name
    const nameExists = await db.Package.findOne({ where: { userId, name } });
    if (nameExists) {
        throw new ApiError('You already have a package with this name', HttpStatus.BAD_REQUEST);
    }

    // Check for same price
    const priceExists = await db.Package.findOne({ where: { userId, price } });
    if (priceExists) {
        throw new ApiError('You already have a package with this price', HttpStatus.BAD_REQUEST);
    }

    const packageItem = await db.Package.create(data);
    return packageItem;
};

/**
 * Update package with validation:
 * Only allow update once every 7 days
 */
export const updatePackage = async (id: number, data: TUpdatePackageInput) => {
    const packageItem = await db.Package.findByPk(id) as (typeof db.Package.prototype) & { updatedAt: Date, createdAt: Date };
    if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);

    const lastUpdated = packageItem.updatedAt || packageItem.createdAt;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
        throw new ApiError('Package can only be updated once every 7 days', HttpStatus.BAD_REQUEST);
    }

    await packageItem.update(data);
    return packageItem;
};

/**
 * Delete a package
 */
export const deletePackage = async (id: number) => {
    const packageItem = await db.Package.findByPk(id);
    if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);

    await packageItem.destroy();
};

/**
 * Get all packages
 */
export const getAllPackages = async () => {
    return db.Package.findAll();
};

/**
 * Get package by ID
 */
export const getPackageById = async (id: number) => {
    const packageItem = await db.Package.findByPk(id);
    if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);
    return packageItem;
};

// Get all packages for a user
export const getPackages = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.query.userId);
    if (!userId) {
        throw new ApiError('userId query parameter is required', HttpStatus.BAD_REQUEST);
    }

    const packages = await db.Package.findAll({ where: { userId } });
    sendSuccess(res, 'Packages fetched successfully', HttpStatus.OK, packages);
});

/**
 * Helper: Get user by ID
 */
export const getUserById = async (id: number) => {
    return db.User.findByPk(id);
};
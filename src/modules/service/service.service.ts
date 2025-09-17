// service.service.ts
import { HttpStatus } from '@src/constants/httpStatus';
import db from '@src/database/models';
import { ApiError } from '@src/utils/ApiError';
import logger from '@src/utils/logger';
import { TCreateCategoryInput, TUpdateCategoryInput } from '@src/database/models/category.model';
import { TCreatePackageInput, TUpdatePackageInput } from '@src/database/models/package.model';

/**
 * Create a new category
 * 
 * @param input - The category data to create
 * @returns The created category instance
 * @throws ApiError if creation fails or required fields are missing
 */
export const createCategory = async (input: TCreateCategoryInput) => {
  if (!input.name || !input.icon) {
    throw new ApiError('Name and icon are required', HttpStatus.BAD_REQUEST);
  }

  try {
    logger.info(`Creating category: ${input.name}`);
    const category = await db.Category.create(input);
    return category;
  } catch (error) {
    logger.error('Failed to create category', error);
    throw new ApiError('Category creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update an existing category
 * 
 * @param categoryId - The ID of the category to update
 * @param input - The fields to update
 * @returns The updated category instance
 * @throws ApiError if category not found or update fails
 */
export const updateCategory = async (categoryId: number, input: TUpdateCategoryInput) => {
  try {
    logger.info(`Updating category ID: ${categoryId}`);
    const category = await db.Category.findByPk(categoryId);

    if (!category) {
      throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
    }

    await category.update(input);
    return category;
  } catch (error) {
    logger.error(`Failed to update category ID: ${categoryId}`, error);
    throw new ApiError('Category update failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};


/**
 * Fetch all categories from the database
 * 
 * @returns Promise resolving to an array of category instances
 */
export const getAllCategories = async () => {
  try {
    logger.info('Fetching all categories');
    const categories = await db.Category.findAll();
    logger.info(`Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    logger.error('Failed to fetch categories', error);
    throw new ApiError('Failed to fetch categories', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Fetch a single category by its ID
 * 
 * @param id - The ID of the category to fetch
 * @returns Promise resolving to the category instance or null if not found
 * @throws ApiError if database query fails
 */
export const getCategoryById = async (id: number) => {
  try {
    logger.info(`Fetching category with ID: ${id}`);
    const category = await db.Category.findByPk(id);

    if (!category) {
      logger.warn(`Category not found with ID: ${id}`);
      return null; // Controller can handle the 404 response
    }

    logger.info(`Category found with ID: ${id}`);
    return category;
  } catch (error) {
    logger.error(`Failed to fetch category with ID: ${id}`, error);
    throw new ApiError('Failed to fetch category', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete a category by its ID
 * 
 * @param id - The ID of the category to delete
 * @returns Promise resolving to void
 * @throws ApiError if category not found or deletion fails
 */
export const deleteCategory = async (id: number) => {
  try {
    logger.info(`Deleting category with ID: ${id}`);
    const category = await db.Category.findByPk(id);

    if (!category) {
      logger.warn(`Category not found with ID: ${id}`);
      throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
    }

    await category.destroy();
    logger.info(`Category deleted with ID: ${id}`);
  } catch (error) {
    logger.error(`Failed to delete category with ID: ${id}`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to delete category', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};


///================Package Services=================
/**
 * Create a new package
 * @param payload - package data
 * @returns created package
 * @throws ApiError if creation fails
 */
export const createPackage = async (payload: TCreatePackageInput) => {
  const packageItem = await db.Package.create(payload);
  return packageItem;
};

/**
 * Update an existing package by ID
 * @param id - package ID
 * @param payload - fields to update
 * @returns updated package
 * @throws ApiError if package not found
 */
export const updatePackage = async (id: number, payload: TUpdatePackageInput) => {
  const packageItem = await db.Package.findByPk(id);
  if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);
  await packageItem.update(payload);
  return packageItem;
};

/**
 * Delete a package by ID
 * @param id - package ID
 * @throws ApiError if package not found
 */
export const deletePackage = async (id: number) => {
  const packageItem = await db.Package.findByPk(id);
  if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);
  await packageItem.destroy();
};

/**
 * Get all packages
 * @returns list of packages
 */
export const getAllPackages = async () => {
  return db.Package.findAll();
};

/**
 * Get package by ID
 * @param id - package ID
 * @returns package
 * @throws ApiError if not found
 */
export const getPackageById = async (id: number) => {
  const packageItem = await db.Package.findByPk(id);
  if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);
  return packageItem;
};
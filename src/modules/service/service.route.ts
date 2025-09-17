// service.route.ts
import { Router } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import validateRequest from '@src/middlewares/validateRequest';
import * as serviceController from './service.controller';
import { createCategoryValidationSchema, createPackageValidationSchema, updateCategoryValidationSchema, updatePackageValidationSchema } from './service.validation';

const router = Router();

// POST /createCategory
router.post('/createCategory', authMiddleware, validateRequest(createCategoryValidationSchema), serviceController.createCategory);

// GET /categories
router.get('/categories', serviceController.getCategories);

// GET /categories/:id
router.get('/categories/:id', serviceController.getCategoryById);

// PATCH /categories/:id
router.patch('/categories/:id', authMiddleware, validateRequest(updateCategoryValidationSchema), serviceController.updateCategory);

// DELETE /categories/:id
router.delete('/categories/:id', authMiddleware, serviceController.deleteCategory);


//===============Package Routes=================
// Create package
router.post(
  '/createPackage',
  authMiddleware,
  validateRequest(createPackageValidationSchema),
  serviceController.createPackage
);

// Get all packages
router.get('/packages', serviceController.getAllPackages);

// Get package by ID
router.get('/packages/:id', serviceController.getPackageById);

// Get package by user ID
router.get('/packages/:userId', serviceController.getPackages);

// Update package by ID
router.patch(
  '/packages/:id',
  authMiddleware,
  validateRequest(updatePackageValidationSchema),
  serviceController.getPackageById
);

// Delete package by ID
router.delete('/packages/:id', authMiddleware, serviceController.deletePackage);


const serviceRoute = router;

export default serviceRoute;

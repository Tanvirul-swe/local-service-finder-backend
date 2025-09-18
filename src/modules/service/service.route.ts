// service.route.ts
import { Router } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import validateRequest from '@src/middlewares/validateRequest';
import * as serviceController from './service.controller';
import { createCategoryValidationSchema, createPackageValidationSchema, createPortfolioValidationSchema, updateCategoryValidationSchema, updatePackageValidationSchema, updatePortfolioValidationSchema } from './service.validation';

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
// router.get('/packages', serviceController.getPackagesByUserId);

// Get package by ID
// router.get('/packages/:id', serviceController.getPackagesByUserId);

// Get package by user ID
router.get('/packages/:userId', serviceController.getPackagesByUserId);

// Update package by ID
router.patch(
  '/updatePackage/:id',
  authMiddleware,
  validateRequest(updatePackageValidationSchema),
  serviceController.updatePackage
);

// Delete package by ID
router.delete('/deletePackage/:id', authMiddleware, serviceController.deletePackage);

//============================================ Portfolio Routes ================================
router.post(
  '/portfolioCreate',
  authMiddleware,
  validateRequest(createPortfolioValidationSchema),
  serviceController.createPortfolio
);

router.patch(
  '/updatePortfolio/:id',
  authMiddleware,
  validateRequest(updatePortfolioValidationSchema),
  serviceController.updatePortfolio
);
// Get portfolio by user ID
router.get('/portfolios/:userId', serviceController.getPortfoliosByUserId);

// Delete portfolio by ID
router.delete('/deletePortfolio/:id', authMiddleware, serviceController.deletePortfolio);


const serviceRoute = router;

export default serviceRoute;

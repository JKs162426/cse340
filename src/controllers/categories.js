import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
  } from '../models/categories.js';

  import { getProjectDetails } from '../models/projects.js';

import { body, validationResult } from 'express-validator';

const categoryRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required.')
      .isLength({ min: 3 })
      .withMessage('Category name must be at least 3 characters long.')
      .isLength({ max: 100 })
      .withMessage('Category name must be 100 characters or fewer.')
  ];
};
  
  const showCategoriesPage = async (req, res, next) => {
    try {
      const categories = await getAllCategories();
      const title = 'Service Categories';
      res.render('categories', { title, categories });
    } catch (error) {
      next(error);
    }
  };
  
  const showCategoryDetailsPage = async (req, res, next) => {
    try {
      const id = req.params.id;
      const categoryDetails = await getCategoryDetails(id);
  
      if (!categoryDetails) {
        const error = new Error('Category not found');
        error.status = 404;
        throw error;
      }
  
      const projects = await getProjectsByCategoryId(id);
      const title = categoryDetails.name;
  
      res.render('category', { title, categoryDetails, projects });
    } catch (error) {
      next(error);
    }
  };

  const showAssignCategoriesForm = async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
  
      const projectDetails = await getProjectDetails(projectId);
      const categories = await getAllCategories();
      const assignedCategories = await getCategoriesByServiceProjectId(projectId);
  
      const title = 'Assign Categories to Project';
  
      res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
      });
    } catch (error) {
      next(error);
    }
  };
  
  const processAssignCategoriesForm = async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const selectedCategoryIds = req.body.categories || [];
  
      const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];
  
      await updateCategoryAssignments(projectId, categoryIdsArray);
      req.flash('success', 'Categories updated successfully.');
      res.redirect(`/projects/${projectId}`);
    } catch (error) {
      next(error);
    }
  };

const showNewCategoryForm = async (req, res, next) => {
  try {
    const title = 'Create New Category';
    res.render('new-category', { title });
  } catch (error) {
    next(error);
  }
};

const processNewCategoryForm = async (req, res, next) => {
  const { name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect('/new-category');
  }

  try {
    const categoryId = await createCategory(name);
    req.flash('success', 'Category created successfully.');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    next(error);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    if (!categoryDetails) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails });
  } catch (error) {
    next(error);
  }
};

const processEditCategoryForm = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect(`/edit-category/${categoryId}`);
  }

  try {
    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully.');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    next(error);
  }
};
  
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryRules };
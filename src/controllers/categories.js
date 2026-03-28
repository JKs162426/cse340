import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
  } from '../models/categories.js';
  
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

  const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};
  
  export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
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
  
  export { showCategoriesPage, showCategoryDetailsPage };
import db from './db.js';

const getAllCategories = async () => {
  try {
    const query = `
      SELECT category_id, name
      FROM category
      ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getCategoryDetails = async (id) => {
  try {
    const query = `
      SELECT category_id, name
      FROM category
      WHERE category_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching category details:', error);
    throw error;
  }
};

const getProjectsByCategoryId = async (categoryId) => {
  try {
    const query = `
      SELECT
        p.project_id,
        p.title,
        p.start_date AS date,
        p.organization_id,
        o.name AS organization_name
      FROM projects p
      JOIN project_category pc
        ON p.project_id = pc.project_id
      JOIN category c
        ON pc.category_id = c.category_id
      JOIN organization o
        ON p.organization_id = o.organization_id
      WHERE c.category_id = $1
      ORDER BY p.start_date;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching projects by category id:', error);
    throw error;
  }
};

const assignCategoryToProject = async(categoryId, projectId) => {
  const query = `
      INSERT INTO project_category (category_id, project_id)
      VALUES ($1, $2);
  `;

  await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
      DELETE FROM project_category
      WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
      await assignCategoryToProject(categoryId, projectId);
  }
}

const getCategoriesByServiceProjectId = async (projectId) => {
  try {
    const query = `
      SELECT
        c.category_id,
        c.name
      FROM category c
      JOIN project_category pc
        ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories by service project id:', error);
    throw error;
  }
};

export { getAllCategories, getCategoryDetails, getProjectsByCategoryId, assignCategoryToProject, updateCategoryAssignments, getCategoriesByServiceProjectId };
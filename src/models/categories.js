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

export { getAllCategories, getCategoryDetails, getProjectsByCategoryId };
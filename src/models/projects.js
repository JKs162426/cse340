import db from './db.js';

const getUpcomingProjects = async (numberOfProjects) => {
  try {
    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.start_date AS date,
        p.project_location AS location,
        p.organization_id,
        o.name AS organization_name
      FROM projects p
      JOIN organization o
        ON p.organization_id = o.organization_id
      WHERE p.start_date >= CURRENT_DATE
      ORDER BY p.start_date ASC
      LIMIT $1;
    `;

    const result = await db.query(query, [numberOfProjects]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching upcoming projects:', error);
    throw error;
  }
};

const getProjectDetails = async (id) => {
  try {
    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.start_date AS date,
        p.project_location AS location,
        p.organization_id,
        o.name AS organization_name
      FROM projects p
      JOIN organization o
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      project_location,
      start_date
    FROM projects
    WHERE organization_id = $1
    ORDER BY start_date;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};

const getCategoriesByProjectId = async (projectId) => {
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
    console.error('Error fetching categories by project id:', error);
    throw error;
  }
};

export { getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, getCategoriesByProjectId };
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

const createProject = async (title, description, project_location, start_date, organization_id) => {
  const query = `
    INSERT INTO projects (title, description, project_location, start_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const query_params = [title, description, project_location, start_date, organization_id];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
      throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (project_id, organization_id, title, description, project_location, start_date) => {
  try {
  const query = `
    UPDATE projects
    SET organization_id = $1, title = $2, description = $3, project_location = $4, start_date = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const query_params = [organization_id, title, description, project_location, start_date, project_id];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', project_id);
  }

  return result.rows[0].project_id;
  }
  catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};


export { getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, getCategoriesByProjectId, createProject, updateProject };
import db from './db.js';

const getUpcomingProjects = async (numberOfProjects) => {
  try {
    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.start_date AS date,
        p.project_location,
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
        p.project_location,
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

const addVolunteerToProject = async (userId, projectId) => {
  const query = `
      INSERT INTO project_volunteer (user_id, project_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, project_id) DO NOTHING;
  `;
  await db.query(query, [userId, projectId]);
};

const removeVolunteerFromProject = async (userId, projectId) => {
  const query = `
      DELETE FROM project_volunteer
      WHERE user_id = $1 AND project_id = $2;
  `;
  await db.query(query, [userId, projectId]);
};

const getVolunteerProjectsByUserId = async (userId) => {
  const query = `
      SELECT
          p.project_id,
          p.title,
          p.description,
          p.start_date,
          p.project_location,
          p.organization_id,
          o.name AS organization_name
      FROM project_volunteer pv
      JOIN projects p ON pv.project_id = p.project_id
      JOIN organization o ON p.organization_id = o.organization_id
      WHERE pv.user_id = $1
      ORDER BY p.start_date;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

const isUserVolunteeringForProject = async (userId, projectId) => {
  const query = `
      SELECT 1
      FROM project_volunteer
      WHERE user_id = $1 AND project_id = $2;
  `;
  const result = await db.query(query, [userId, projectId]);
  return result.rows.length > 0;
};


export { getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, getCategoriesByProjectId, createProject, updateProject, addVolunteerToProject, removeVolunteerFromProject, getVolunteerProjectsByUserId, isUserVolunteeringForProject };
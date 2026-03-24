import {
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId
} from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
  } catch (error) {
    next(error);
  }
};

const showProjectDetailPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const project = await getProjectDetails(id);

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    const categories = await getCategoriesByProjectId(id);
    const title = project.title;

    res.render('project', { title, project, categories });
  } catch (error) {
    next(error);
  }
};

export { showProjectsPage, showProjectDetailPage };
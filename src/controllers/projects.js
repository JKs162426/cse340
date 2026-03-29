import {
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId,
  createProject,
  updateProject
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const projectValidation = [
  body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('project_location')
      .trim()
      .notEmpty().withMessage('Location is required')
      .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  body('start_date')
      .notEmpty().withMessage('Date is required')
      .isISO8601().withMessage('Date must be a valid date format'),
  body('organization_id')
      .notEmpty().withMessage('Organization is required')
      .isInt().withMessage('Organization must be a valid integer')
];

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

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project';

  res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
   // Check for validation errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       // Loop through validation errors and flash them
       errors.array().forEach((error) => {
           req.flash('error', error.msg);
       });

       // Redirect back to the new project form
       return res.redirect('/new-project');
   }

  // Extract form data from req.body
  const { title, description, project_location, start_date, organization_id } = req.body;

  try {
      // Create the new project in the database
      const newProjectId = await createProject(title, description, project_location, start_date, organization_id);

      req.flash('success', 'New service project created successfully!');
      res.redirect(`/projects/${newProjectId}`);
  } catch (error) {
      console.error('Error creating new project:', error);
      req.flash('error', 'There was an error creating the service project.');
      res.redirect('/new-project');
  }
}

const showEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    if (!projectDetails) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }

    const title = 'Edit Service Project';
    res.render('edit-project', { title, projectDetails, organizations });
  } catch (error) {
    next(error);
  }
};

const processEditProjectForm = async (req, res, next) => {
  const projectId = req.params.id;
  const { title, description, project_location, start_date, organization_id } = req.body;

  // Check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.redirect(`/edit-project/${projectId}`);
  }

  try {
    await updateProject(
      projectId,
      organization_id,
      title,
      description,
      project_location,
      start_date
    );

    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/projects/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    req.flash('error', 'There was an error updating the service project.');
    res.redirect(`/edit-project/${projectId}`);
  }
};

export { showProjectsPage, showProjectDetailPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm };
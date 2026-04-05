import express from 'express';

import { showHomePage } from './index.js';
import {
  showProjectsPage,
  showProjectDetailPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm
} from './projects.js';
import { showNewOrganizationForm } from './new-organizations.js';
import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryRules
} from './categories.js';
import { testErrorPage } from './errors.js';
import {
  showOrganizationDetailsPage,
  showOrganizationsPage,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm
} from './organizations.js';

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole
} from './users.js';

import {
  userValidation,
  processEditUserForm,
  showEditUserForm,
  showRegisteredUsersPage
} from './registered-users.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidation, processEditOrganizationForm);

router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/projects', showProjectsPage);
router.get('/projects/:id', showProjectDetailPage);
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryRules(), processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryRules(), processEditCategoryForm);

router.get('/assign-categories/:projectId', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, requireRole('admin'), processAssignCategoriesForm);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);

router.get('/registered-users', requireLogin, requireRole('admin'), showRegisteredUsersPage);
router.get('/edit-user/:id', requireLogin, requireRole('admin'), showEditUserForm);
router.post('/edit-user/:id', requireLogin, requireRole('admin'), userValidation, processEditUserForm);

router.get('/test-error', testErrorPage);

export default router;
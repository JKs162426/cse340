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
    processAssignCategoriesForm
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

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/projects', showProjectsPage);
router.get('/projects/:id', showProjectDetailPage );
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/test-error', testErrorPage);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);


export default router;
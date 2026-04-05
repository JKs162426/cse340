import { getAllUsers, getUserDetails, updateUser } from '../models/users.js';
import { body, validationResult } from 'express-validator';

const userValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const showRegisteredUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.render('registered-users', {
            title: 'Registered Users',
            users
        });
    } catch (error) {
        console.error('Error fetching registered users:', error);
        req.flash('error', 'An error occurred while fetching registered users. Please try again.');
        return res.redirect('/');
    }
};

const showEditUserForm = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await getUserDetails(userId);

        if (!userDetails) {
            req.flash('error', 'User not found');
            return res.redirect('/registered-users');
        }

        const title = 'Edit User';
        return res.render('edit-user', { title, userDetails });
    } catch (error) {
        console.error('Error fetching user details:', error);
        req.flash('error', 'An error occurred while fetching user details. Please try again.');
        return res.redirect('/registered-users');
    }
};

const processEditUserForm = async (req, res) => {
    const userId = req.params.id;
    const { name, email, role_id } = req.body;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/edit-user/' + userId);
    }

    try {
        await updateUser(userId, name, email, role_id);
        req.flash('success', 'User updated successfully!');
        return res.redirect('/registered-users');
    } catch (error) {
        console.error('Error updating user:', error);
        req.flash('error', 'An error occurred while updating the user. Please try again.');
        return res.redirect(`/edit-user/${userId}`);
    }
};

export { showRegisteredUsersPage, showEditUserForm, processEditUserForm, userValidation };
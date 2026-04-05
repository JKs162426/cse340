import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user';

    const query = `
        INSERT INTO users (user_name, user_email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id;
    `;

    const queryParams = [name, email, passwordHash, defaultRole];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            u.user_id,
            u.user_name,
            u.user_email,
            u.password_hash,
            r.role_id,
            r.role_name
        FROM users u
        JOIN roles r
          ON u.role_id = r.role_id
        WHERE u.user_email = $1;
    `;

    const queryParams = [email];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        return null;
    }

    return user;
};

const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.user_name,
            u.user_email,
            r.role_id,
            r.role_name
        FROM users u
        JOIN roles r
          ON u.role_id = r.role_id
        ORDER BY u.user_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getUserDetails = async (userId) => {
    const query = `
        SELECT
            u.user_id,
            u.user_name,
            u.user_email,
            r.role_id,
            r.role_name
        FROM users u
        JOIN roles r
          ON u.role_id = r.role_id
        WHERE u.user_id = $1;
    `;

    const result = await db.query(query, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const updateUser = async (userId, name, email, roleId) => {
    const query = `
        UPDATE users
        SET user_name = $1,
            user_email = $2,
            role_id = $3
        WHERE user_id = $4
        RETURNING user_id;
    `;

    const result = await db.query(query, [name, email, roleId, userId]);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    return result.rows[0].user_id;
};

export { createUser, findUserByEmail, authenticateUser, getAllUsers, getUserDetails, updateUser };
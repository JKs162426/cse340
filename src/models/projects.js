import db from './db.js';

const getAllProjects = async () => {
    try {
        const query = `
            SELECT 
                p.project_id, 
                p.title, 
                p.description, 
                p.start_date, 
                o.name AS organization_name
            FROM projects p
            JOIN organization o
            ON p.organization_id = o.organization_id
            ORDER BY p.start_date;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export { getAllProjects };
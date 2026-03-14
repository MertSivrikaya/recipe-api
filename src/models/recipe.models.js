const pool = require('../config/db.config');

/*
    This model provides an abstraction layer for database operations related to recipes.
    This is the only part of the application that directly interacts with the PostgreSQL database. 
    The controller layer will call these methods to perform CRUD operations, 
    and the routes will call the controller methods to handle HTTP requests.
*/


const RecipeModel = {
    // Get all recipes (with a limit for performance)
    getAll: async () => {
        const query = 'SELECT * FROM recipes ORDER BY id ASC LIMIT 50';
        const result = await pool.query(query);
        return result.rows;
    },

    // Create a new recipe
    create: async (title, category, ingredients, directions) => {
        const query = `
            INSERT INTO recipes (title, category, ingredients, directions) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const result = await pool.query(query, [title, category, ingredients, directions]);
        return result.rows[0];
    },

    // Update an existing recipe
    updateById: async (id, title, category, ingredients, directions) => {
        const query = `
            UPDATE recipes 
            SET title = $1, category = $2, ingredients = $3, directions = $4
            WHERE id = $5 
            RETURNING *;
        `;
        const result = await pool.query(query, [title, category, ingredients, directions, id]);
        // Return null if no rows were updated (meaning the ID wasn't found)
        return result.rowCount === 0 ? null : result.rows[0];
    },

    // Delete a recipe
    deleteById: async (id) => {
        const query = 'DELETE FROM recipes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rowCount === 0 ? null : result.rows[0];
    }
};

module.exports = RecipeModel;
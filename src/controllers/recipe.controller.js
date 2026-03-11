const pool = require('../config/db.config');

// Read: Get all recipes (GET)
const getAllRecipes = async (req, res) => {
    try {
        // Limiting to 50 so we don't overwhelm the browser during testing
        const result = await pool.query('SELECT * FROM recipes ORDER BY id ASC LIMIT 50');
        
        // Return a successful 200 status code with the JSON data
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        // Industry convention error code for Server Error
        res.status(500).json({ error: 'Server error while fetching recipes' });
    }
};

// Create: Add a new recipe (POST)
const createRecipe = async (req, res) => {
    try {
        const { title, category, ingredients, directions } = req.body;
        
        // Basic validation: Title is required
        if (!title) {
            return res.status(400).json({ error: 'Recipe title is required' });
        }

        const newRecipe = await pool.query(
            'INSERT INTO recipes (title, category, ingredients, directions) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, category, ingredients, directions]
        );

        // Return a successful 201 Created status code
        res.status(201).json(newRecipe.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while creating recipe' });
    }
};

// Update: Modify an existing recipe (PUT)
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, ingredients, directions } = req.body;

        const updateQuery = `
            UPDATE recipes 
            SET title = $1, category = $2, ingredients = $3, directions = $4
            WHERE id = $5 
            RETURNING *;
        `;

        const result = await pool.query(updateQuery, [title, category, ingredients, directions, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while updating recipe' });
    }
};

// Delete: Remove a recipe (DELETE)
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteQuery = 'DELETE FROM recipes WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe successfully deleted', deletedRecipe: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while deleting recipe' });
    }
};

// Don't forget to export the new functions!
module.exports = {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
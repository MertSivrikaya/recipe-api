
/*
    Using a layered system architecture, the routing layer forwards incoming HTTP requests to the controller layer,
    which manages the HTTP logic. The controller layer calls the model layer to perform database operations, 
    and then sends the appropriate HTTP response back to the client.

    This separation of concerns allows for better maintainability and scalability, as each layer can be developed and tested independently.


*/

const RecipeModel = require('../models/recipe.model');

// Read: Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModel.getAll();
        res.status(200).json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching recipes' });
    }
};

// Create: Add a new recipe
const createRecipe = async (req, res) => {
    try {
        const { title, category, ingredients, directions } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Recipe title is required' });
        }

        const newRecipe = await RecipeModel.create(title, category, ingredients, directions);
        res.status(201).json(newRecipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while creating recipe' });
    }
};

// Update: Modify an existing recipe
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, ingredients, directions } = req.body;

        const updatedRecipe = await RecipeModel.updateById(id, title, category, ingredients, directions);

        if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json(updatedRecipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while updating recipe' });
    }
};

// Delete: Remove a recipe
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecipe = await RecipeModel.deleteById(id);

        if (!deletedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe successfully deleted', deletedRecipe });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while deleting recipe' });
    }
};

module.exports = {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
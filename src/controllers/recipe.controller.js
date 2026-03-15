/*
    Using a layered system architecture, the routing layer forwards incoming HTTP requests to the controller layer,
    which manages the HTTP logic. The controller layer calls the model layer to perform database operations, 
    and then sends the appropriate HTTP response back to the client.

    This separation of concerns allows for better maintainability and scalability, as each layer can be developed and tested independently.


*/

// This is the essence of a Layered System. 
// Out controller doesn't know how to talk to PostgreSQL; 
// it just imports RecipeModel and trusts it to do the heavy lifting. 
// This makes our code modular. If we ever switched from PostgreSQL to another DBMS,
// we would only have to rewrite the model file, not this controller.
const RecipeModel = require('../models/recipe.model');

// Read: Get all recipes
const getAllRecipes = async (req, res, next) => {
    try {
        // To avoid blocking calls, 
        // we use 'await' to wait for the database operation to complete before sending the response.
        // The 'await' keyword pauses the execution of this specific function, not the whole code,
        // until the database query is complete,
        // allowing other requests to be handled in the meantime.
        const recipes = await RecipeModel.getAll();
        res.status(200).json(recipes);
    } catch (err) {
        // If a database connection fails or a query is malformed, the code jumps into the catch block.

        // The 'next()' function is used to pass control to the next middleware in the stack.
        // Pass the error to the centralized error handler
        next(err); 
    }
};

// Create: Add a new recipe
const createRecipe = async (req, res, next) => {
    try {
        const { title, category, ingredients, directions } = req.body;
        
        if (!title) {
            // Status code 400 means "Bad Request". It's the standard response for requests that are missing required fields or have invalid data.
            return res.status(400).json({ error: 'Recipe title is required' });
        }

        const newRecipe = await RecipeModel.create(title, category, ingredients, directions);

        // Status code 201 means "Created". It's the standard response for successful POST requests that create a new resource.
        // This is where we bridge the semantic gap for automated clients. 
        // Instead of sending back HTML, we send back structured JSON
        res.status(201).json(newRecipe);
    } catch (err) {
        next(err); 
    }
};

// Update: Modify an existing recipe
const updateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, category, ingredients, directions } = req.body;

        const updatedRecipe = await RecipeModel.updateById(id, title, category, ingredients, directions);

        if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json(updatedRecipe);
    } catch (err) {
        next(err); 
    }
};

// Delete: Remove a recipe
const deleteRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRecipe = await RecipeModel.deleteById(id);

        if (!deletedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe successfully deleted', deletedRecipe });
    } catch (err) {
        next(err); 
    }
};

// module.exports is how we export functions from this file so that they can be imported and used in other files.
module.exports = {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

// Read all (GET)
router.get('/', recipeController.getAllRecipes);

// Create new (POST)
router.post('/', recipeController.createRecipe);

// Update existing by ID (PUT)
router.put('/:id', recipeController.updateRecipe);

// Delete existing by ID (DELETE)
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

// Map the routes to the controller functions
router.get('/', recipeController.getAllRecipes);
router.post('/', recipeController.createRecipe);

module.exports = router;
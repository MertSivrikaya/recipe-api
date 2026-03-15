const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const verifyToken = require('../middlewares/auth.middleware');

// The '/' means the "root" of this specific router. 
// Since we attached this router to /api/recipes inside our server.js file, 
// a GET request to http://localhost:3000/api/recipes/ will trigger the getAllRecipes function.

/* ********************************************************************************* */
/* PUBLIC ROUTES (Anyone can view the recipes */

// Read all (GET)
router.get('/', recipeController.getAllRecipes); // This route will handle GET requests to /api/recipes and call the getAllRecipes controller function.
/* ********************************************************************************* */

/* ********************************************************************************* */
/* PROTECTED ROUTES (Only authenticated users can create, update, or delete recipes) */
// Express will run the verifyToken middleware first, and only call our controller if the token is valid.

// Create new (POST)
router.post('/', verifyToken ,recipeController.createRecipe);

// Update existing by ID (PUT)
router.put('/:id', verifyToken, recipeController.updateRecipe);

// The colon (:) is a special syntax in Express. It defines a URL Parameter.
// It tells Express that whatever value the user types after the slash is a dynamic variable, 
// not a literal word.

// It packages that variable into the req.params object.

// Delete existing by ID (DELETE)
router.delete('/:id', verifyToken, recipeController.deleteRecipe);
/* ********************************************************************************* */

module.exports = router;
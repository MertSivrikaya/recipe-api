const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const verifyToken = require('../middlewares/auth.middleware');

// The '/' means the "root" of this specific router. 
// Since we attached this router to /api/recipes inside our server.js file, 
// a GET request to http://localhost:3000/api/recipes/ will trigger the getAllRecipes function.

/* ********************************************************************************* */
/* PUBLIC ROUTES (Anyone can view the recipes */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Retrieve a list of all recipes (only first 50 of them for development and performance purposes).
 *     description: Fetches all recipes from the PostgreSQL database. This route is public; hence, doesn't require authentication.
 *     responses:
 *       200:
 *         description: A JSON array of recipe objects.
 *       500:
 *         description: Server error.
 */
router.get('/', recipeController.getAllRecipes); // This route will handle GET requests to /api/recipes and call the getAllRecipes controller function.
/* ********************************************************************************* */

/* ********************************************************************************* */
/* PROTECTED ROUTES (Only authenticated users can create, update, or delete recipes) */
// Express will run the verifyToken middleware first, and only call our controller if the token is valid.

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Adds a new recipe to the database. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               directions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe successfully created.
 *       400:
 *         description: Bad request (missing title).
 *       401:
 *         description: Unauthorized.
 */
router.post('/', verifyToken ,recipeController.createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update an existing recipe
 *     description: Modifies a recipe by its ID. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               directions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipe successfully updated.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Recipe not found.
 */
router.put('/:id', verifyToken, recipeController.updateRecipe);

// The colon (:) is a special syntax in Express. It defines a URL Parameter.
// It tells Express that whatever value the user types after the slash is a dynamic variable, 
// not a literal word.

// It packages that variable into the req.params object.

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     description: Removes a recipe from the database by its ID. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID to delete
 *     responses:
 *       200:
 *         description: Recipe successfully deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Recipe not found.
 */
router.delete('/:id', verifyToken, recipeController.deleteRecipe);
/* ********************************************************************************* */

module.exports = router;
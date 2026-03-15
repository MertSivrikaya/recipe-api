const express = require('express');

// By calling config(), Node reads our hidden .env file and loads those variables (like our database password) into process.env. 
// This ensures sensitive data is never hardcoded directly into our source code where it could be pushed to GitHub.
require('dotenv').config();

const pool = require('./src/config/db.config');

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

/* 
    CORS stands for Cross-Origin Resource Sharing. It is a strict security mechanism built into all modern web browsers.
    By default, if we have a frontend website running on http://localhost:8080 and it tries to fetch recipes from our API running on http://localhost:3000, 
    the web browser will panic and block the request. It thinks a malicious website is trying to secretly steal data from our server.

    "We used app.use(cors()) to globally allow cross-origin requests for prototyping. 
    In a production environment, we would pass a configuration object to strictly limit access to 
    only our official frontend domain."
*/
// Enable CORS for all routes (allows browsers to communicate with your API)
app.use(cors());

// Middleware to automatically parse incoming JSON requests
// In Express, when a request comes in, it goes through a series of middleware functions before reaching the route handler.
// We use app.use() to add middleware to our Express application. 
app.use(express.json()); // intercepts incoming requests that have a JSON body and parses that JSON into a JavaScript object, which is then attached to the req.body property of the request object.

// A simple home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Foods & Recipes API!' });
});

// Import and use the authentication routes
// All routes inside authRoutes will be prefixed with /api/auth
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

// Import and use the recipe routes
// "If a request URL starts with /api/recipes, then use the recipeRoutes router to handle it."
const recipeRoutes = require('./src/routes/recipe.routes');
app.use('/api/recipes', recipeRoutes);

// A route to test our PostgreSQL connection
app.get('/test-db', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ 
            success: true, 
            message: 'Database connected successfully!',
            serverTime: result.rows[0].now 
        });
    } catch (err) {
        // Pass the error to your new centralized handler using next()
        next(err);
    }
});

// To force Express to return a clean JSON response for any URL that doesn't exist, 
// we just need to add a "catch-all" route at the very end of our routing pipeline.
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// If any of the routes above throw an error and call next(err), 
// Express skips everything else and drops the error right into this handler, 
// ensuring the user gets a formatted JSON response instead of crashing the server.
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// This tells Node.js to open up the specified network port and continuously listen for incoming HTTP traffic. 
// The callback function executes once the server is successfully bound to the port.
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
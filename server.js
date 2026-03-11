const express = require('express');
require('dotenv').config();
const pool = require('./src/config/db.config');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to automatically parse incoming JSON requests
app.use(express.json());

// A simple home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Foods & Recipes API!' });
});

// A route to test our PostgreSQL connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ 
            success: true, 
            message: 'Database connected successfully!',
            serverTime: result.rows[0].now 
        });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to connect to the database. Check your .env credentials.' 
        });
    }
});

// Import and use the recipe routes
const recipeRoutes = require('./src/routes/recipe.routes');
app.use('/api/recipes', recipeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
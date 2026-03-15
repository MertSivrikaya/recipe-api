const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./config/db.config');

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        ingredients TEXT,
        directions TEXT
    );
`;

const insertRecordQuery = `
    INSERT INTO recipes (title, category, ingredients, directions)
    VALUES ($1, $2, $3, $4)
`;

async function importCSV() {
    try {
        // 1. Create the table
        await pool.query(createTableQuery);
        console.log('Table "recipes" is ready.');

        let count = 0;
        const limit = 500; // Safely limit to 500 records for testing

        // 2. Read the CSV as an asynchronous stream
        const stream = fs.createReadStream('dataset.csv').pipe(csv());

        for await (const row of stream) {
            // Stop importing once we hit the limit
            if (count >= limit) {
                break; 
            }

            try {
                // Match the exact Kaggle CSV headers
                const title = row['Title'] || 'Unknown Recipe';
                const category = row['Category'] || 'Uncategorized';
                const ingredients = row['Ingredients'] || '[]';
                const directions = row['Directions'] || '[]';

                await pool.query(insertRecordQuery, [title, category, ingredients, directions]);
                count++;
            } catch (insertErr) {
                console.error('Error inserting row:', insertErr.message);
            }
        }
        
        console.log(`Import complete! Successfully inserted ${count} records.`);
        process.exit(0); // Exit the script successfully

    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
}

// Run the function
importCSV();
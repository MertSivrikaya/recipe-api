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
        await pool.query('DROP TABLE IF EXISTS recipes');
        console.log('Old table dropped.');

        // Create the table
        await pool.query(createTableQuery);
        console.log('Table "recipes" is ready.');

        let count = 0;
        const limit = 500; // Safely limit to 500 records for testing

        // Read the CSV as an asynchronous stream
        const fullDatasetPath = 'dataset.csv';
        const sampleDatasetPath = 'sample_dataset.csv';

        // Dynamically determine which file to use
        const fileToUse = fs.existsSync(fullDatasetPath) ? fullDatasetPath : sampleDatasetPath;
        console.log(`Starting database import using: ${fileToUse}`);

        // Update your stream to use the dynamic variable instead of a hardcoded string
        const stream = fs.createReadStream(fileToUse).pipe(csv());

        for await (const row of stream) {
            // Stop importing once we hit the limit
            if (count >= limit) {
                break; 
            }

            try {
                const title = row['recipe_title'] || 'Unknown Recipe';
                const category = row['category'] || 'Uncategorized';
                const ingredients = row['ingredients'] || '[]';
                const directions = row['directions'] || '[]';

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
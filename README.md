# Foods & Recipes REST API

A Layered Architecture RESTful API built with Node.js, Express, and PostgreSQL. It features full CRUD operations and is secured using JWT authentication.

## API Documentation
The complete interactive API documentation was generated using Swagger UI. 
A static export of this documentation can be found here: **[API_Documentation.pdf](./API_Documentation.pdf)**

*(Note: To view the live, interactive Swagger UI, start the server and navigate to `http://localhost:3000/api-docs`)*

## Local Execution Instructions

Follow these steps to run the API on your local machine:

### 1. Dataset Setup (Important for Local Execution)
For testing purposes, a small dataset called `sample_dataset.csv` is included in the repository. However, to keep the repository lightweight, the large CSV dataset is not included. To populate the database with the complete dataset, you must download it manually:

1. Download the dataset from here: **[https://www.kaggle.com/datasets/prashantsingh001/recipes-dataset-64k-dishes?resource=download]**
2. Extract the file and rename it exactly to `dataset.csv`.
3. Place `dataset.csv` directly into the root directory of this project (in the same folder as `server.js`).

*Note: If the large dataset is present in the root folder, the import script automatically detect it and use it instead of the sample dataset.*

### 2. Database Setup
1. Ensure PostgreSQL is installed and running.
2. Create a new database named `recipes_db` (or your preferred name).
3. The application will automatically create the `recipes` table and clear stale data when you run the import script.

### 3. Environment Variables
Create a `.env` file in the root directory of the project and add the following variables:
```text
PORT=3000
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_key_here
```

### 4. Installation & Startup
Open your terminal in the project directory and run the following commands in order:

```bash
# 1. Install all required dependencies
npm install

# 2. Import the dataset into PostgreSQL (Make sure dataset.csv is in the root folder if using the original dataset!)
node import.js 

# 3. Start the application server
node server.js
```

## Acknowledgments & Data Source
The full recipe dataset optionally used in this project is publicly available on Kaggle and was compiled by Prashant Singh. 

* **Dataset:** [Recipes Dataset (64k+ dishes)](https://www.kaggle.com/datasets/prashantsingh001/recipes-dataset-64k-dishes?resource=download)
* **Author:** Prashant Singh
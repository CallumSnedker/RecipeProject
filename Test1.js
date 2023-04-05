const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// Set up a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'ReadOnly',
  password: 'ReadOnlyPassword',
  database: 'Recipe'
});

// Define a route to display a list of products
app.get('/Recipe', async (req, res) => {
  try {
    // Extract the category parameter from the URL query string
    const category = req.query.category || 'all';
    
    // Execute a MySQL query to retrieve the products based on the category parameter
    const query = `
      SELECT * FROM Recipe 
      ${category !== 'all' ? 'WHERE category = ?' : ''}
    `;
    const params = category !== 'all' ? [category] : [];
    const [rows] = await pool.query(query, params);
    
    // Render the retrieved data using a template engine
    res.render('products', { products: rows, category });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

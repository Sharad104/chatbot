// server.js
const express = require('express');
const path = require('path');
const historyRoutes = require('./routes/historyRoutes'); // Import the history routes
const loginRoutes = require('./routes/loginRoutes'); // Import the login/signup routes

const app = express();

// Middleware to handle form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount the login/signup routes
app.use(loginRoutes);

// Mount the history routes
app.use(historyRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

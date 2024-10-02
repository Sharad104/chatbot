// START of loginRoutes.js


const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const router = express.Router(); // Using a router instead of the main app

const usersFilePath = path.join('database', 'users.json'); // Directly specify the path

// Initialize session middleware here
router.use(session({
    secret: 'rudarkigandmesecretchaabi',
    resave: false,
    saveUninitialized: false,
}));

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Signup route
router.get('/signup', (req, res) => {
    res.send(`
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Signup</title>
            <link rel="stylesheet" href="loginsignupstyle.css">
        </head>
        <body>
            <h1>Signup</h1>
            <form action="/signup" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Signup</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a>.</p>
        </body>
    `);
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) throw err;

        let users = JSON.parse(data);

        const userExists = users.some(user => user.username === username);
        if (userExists) {
            return res.send('User already exists. Try logging in.');
        }

        users.push({ username, password });

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) throw err;
            res.send('Signup successful! You can now <a href="/login">login</a>.');
        });
    });
});

// Login route
router.get('/login', (req, res) => {
    res.send(`
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <link rel="stylesheet" href="loginsignupstyle.css">
        </head>
        <body>
            <h1>Login</h1>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/signup">Signup here</a>.</p>
        </body>
    `);
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) throw err;

        let users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            req.session.user = user;

            req.session.save((err) => {
                if (err) return res.send("An error occurred during login.");
                res.redirect('/');
            });
        } else {
            res.send('Invalid credentials. Please try again.');
        }
    });
});

router.get('/get-username', (req, res) => {
    if (req.session.user.username) {
        res.json({ username: req.session.user.username });
    } else {
        res.json({ username: 'Guest' });
    }
});

// Protected home route
// Route to serve gemini.html
router.get('/', isAuthenticated, (req, res) => {
    // Ensure to use __dirname to create an absolute path
    res.sendFile(path.join(__dirname, '..', 'public', 'gemini.html'));
});


// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error logging out.');
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/login');
    });
});

module.exports = router;

// END of loginRoutes.js
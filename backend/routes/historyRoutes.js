// START of historyRoutes.js


const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router(); // to export these routes to server.js



// API to get history
router.get('/history', (req, res) => {
    const historyFilePath = path.join('database', 'history.json'); // Specify the path to history.json
    fs.readFile(historyFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading history file.');
        }
        res.json(JSON.parse(data)); // Send the data back as JSON
    });
});


// API to handle saving history
router.post('/saveHistory', (req, res) => {
    const newEntry = req.body;

    fs.readFile(path.join('database', 'history.json'), (err, data) => {
        if (err) {
            return res.status(500).send('Error reading history file');
        }

        const history = JSON.parse(data);
        history.push(newEntry);

        fs.writeFile(path.join('database', 'history.json'), JSON.stringify(history), err => {
            if (err) {
                return res.status(500).send('Error saving history');
            }
            res.send({ message: 'History saved successfully!' });
        });
    });
});

// Clear history API
router.post('/clearHistory', (req, res) => {
    const emptyHistory = [];

    fs.writeFile(path.join('database', 'history.json'), JSON.stringify(emptyHistory), (err) => {
        if (err) {
            return res.status(500).send('Error clearing history');
        }
        res.send({ message: 'History cleared successfully!' });
    });
});

module.exports = router;

// END of historyRoutes.js

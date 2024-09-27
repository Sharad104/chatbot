const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json()); // to display post request.body in 
app.use(express.static(path.join(__dirname, 'public')));

// API to handle saving history ?
app.post('/saveHistory', (req, res) => {
    const newEntry = req.body;

    fs.readFile(path.join(__dirname, 'public', 'history.json'), (err, data) => {
        if (err) {
            return res.status(500).send(`Error reading history file at`);
        }

        const history = JSON.parse(data); // yahan par vo history.json me se converot krdiay to array of objects susing parse
        history.push(newEntry); // add kardi usme push kardiya object  

        fs.writeFile(path.join(__dirname, 'public', 'history.json'), JSON.stringify(history), err => {
            if (err) {
                return res.status(500).send('Error saving history');
            }

            res.send({ message: 'History saved successfully!' });
        });
    });
});

app.post('/clearHistory', (req, res) => {
    const emptyHistory = [];

    fs.writeFile(path.join(__dirname, 'public', 'history.json'), JSON.stringify(emptyHistory), (err) => {
        if (err) {
            return res.status(500).send('Error clearing history');
        }

        res.send({ message: 'History cleared successfully!' });
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('http://localhost:3000/ is listening');
});

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Serve static files from the root directory
app.use(express.static(__dirname));

// Special handling for .md files
app.get('*.md', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    try {
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/plain');
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch(err) {
        res.status(500).send('Error reading file');
    }
});

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
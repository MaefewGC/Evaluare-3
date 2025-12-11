const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurare pentru upload imagini
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use(express.static('.')); // Servește fișiere statice (HTML, CSS, JS)
app.use('/uploads', express.static('uploads'));

// Stocare stories în memorie (pentru simplitate; folosește DB în realitate)
let stories = [];

// Endpoint pentru a obține stories
app.get('/api/stories', (req, res) => {
    res.json(stories);
});

// Endpoint pentru a adăuga story
app.post('/api/stories', upload.single('image'), (req, res) => {
    const newStory = {
        text: req.body.text,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        timestamp: Date.now()
    };
    stories.push(newStory);
    res.status(201).json(newStory);
});

// Creează folder uploads dacă nu există
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with specific options
app.use(cors({
    origin: 'http://localhost:3000', // React app's URL
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Parse JSON bodies
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
        }
    }
});

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    // Generate a more user-friendly title
    const date = new Date();
    const title = `Photo ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    res.json({
        success: true,
        imageUrl,
        filename: req.file.filename,
        title: title
    });
});

// Delete endpoint
app.delete('/api/images/:id', (req, res) => {
    try {
        const id = req.params.id;
        const uploadDir = path.join(__dirname, 'public/uploads');

        // Check if upload directory exists
        if (!fs.existsSync(uploadDir)) {
            return res.status(404).json({ error: 'Upload directory not found' });
        }

        // Find the file that matches the ID
        const files = fs.readdirSync(uploadDir);
        const fileToDelete = files.find(file => file.startsWith(id));

        if (!fileToDelete) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(uploadDir, fileToDelete);

        // Delete the file
        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file', details: error.message });
    }
});

// Get all images endpoint
app.get('/api/images', (req, res) => {
    const uploadDir = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        return res.json([]);
    }

    const files = fs.readdirSync(uploadDir);
    const images = files.map(filename => {
        const timestamp = parseInt(filename.split('-')[0]);
        const date = new Date(timestamp);
        const title = `Photo ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        return {
            id: filename.split('.')[0],
            url: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
            title: title,
            tags: []
        };
    });

    res.json(images);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
module.exports = {
    name: 'Express + MongoDB',
    folders: [
        'src',
        'src/controllers',
        'src/models',
        'src/routes',
        'src/middleware',
        'src/utils',
        'src/config'
    ],
    files: {
'src/middleware/logger.js':`// Logger middleware
const logger = (req, res, next) => {
    const start = Date.now();
    
    // Process the request
    next();
    
    // Log after response is sent
    const responseTime = Date.now() - start;
    console.log(
        \`\${new Date().toLocaleString()} | \${req.method} \${req.url} | \${res.statusCode} | \${responseTime}ms\`
    );
};

module.exports = logger;`,
        
'src/server.js':`const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,


'src/routes/index.js': `const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Example routes
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);

module.exports = router;`,
        'src/controllers/userController.js': `const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};`,


'src/models/User.js': `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);`,


'src/config/database.js': (projectName) => `const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || \`mongodb://localhost:27017/${projectName}\`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;`,

'.env': (projectName) => `NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/${projectName}`,


'.gitignore': 
`node_modules/
.env.local
.env.production
.DS_Store
*.log`,
        
        
'package.json': (projectName) => `{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "Node.js backend with MongoDB",
    "main": "src/server.js",
    "scripts": {
        "start": "node src/server.js",
        "dev": "nodemon src/server.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "mongoose": "^7.5.0",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1"
    },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
}`,
        
        
'README.md': (projectName) => 
`# ${projectName}

## Installation
\`\`\`bash
npm install
\`\`\`

## Setup
1. Make sure MongoDB is running locally or update MONGODB_URI in .env
2. Update environment variables in .env file

## Development
\`\`\`bash
npm run dev
\`\`\`

## Production
\`\`\`bash
npm start
\`\`\`
`
    }
};

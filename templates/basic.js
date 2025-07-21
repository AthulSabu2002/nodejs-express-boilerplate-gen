module.exports = {
    name: 'Basic REST API',
    folders: [
        'src',
        'src/controllers',
        'src/routes',
        'src/middleware',
        'src/utils',
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
const routes = require('./routes');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

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


'src/routes/index.js':`const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Example routes
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);

module.exports = router;`,


'src/controllers/userController.js': 
`// Example controller with CRUD operations
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

exports.getUsers = (req, res) => {
    res.json(users);
};

exports.getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
};`,


'.env': 
`NODE_ENV=development
PORT=3000`,


'.gitignore': 
`node_modules/
.env.local
.env.production
.DS_Store
*.log`,

'package.json': (projectName) =>`{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "Node.js backend application",
    "main": "src/server.js",
    "scripts": {
        "start": "node src/server.js",
        "dev": "nodemon src/server.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1"
    },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
}`,


'README.md': (projectName) =>`# ${projectName}
## Installation
\`\`\`bash
npm install
\`\`\`

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

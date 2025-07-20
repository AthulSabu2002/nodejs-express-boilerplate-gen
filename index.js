#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');

// Handle inquirer based on version (CommonJS vs ESM)
let inquirer;
try {
  // Try to import inquirer the CommonJS way
  inquirer = require('inquirer');
  // Check if inquirer is ESM only (v9+)
  if (typeof inquirer.prompt !== 'function') {
    console.error(chalk.yellow('Warning: You seem to be using Inquirer v9+ which only supports ESM.'));
    console.error(chalk.yellow('Please install inquirer v8 with: npm install inquirer@^8.0.0'));
    // Use a simple prompt fallback
    inquirer = {
      prompt: (questions) => {
        // Use default values for a simple fallback
        const answers = {};
        questions.forEach(q => {
          if (q.type === 'list') {
            answers[q.name] = q.default || q.choices[0].value;
          } else if (q.type === 'confirm') {
            answers[q.name] = q.default || false;
          }
        });
        return Promise.resolve(answers);
      }
    };
  }
} catch (error) {
  console.error(chalk.red('Error loading inquirer:'), error.message);
  process.exit(1);
}

// Template configurations
const templates = {
    basic: {
        name: 'Basic REST API',
        folders: [
            'src',
            'src/controllers',
            'src/routes',
            'src/middleware',
            'src/utils',
            'src/config'
        ],
        files: {
            'src/server.js': `const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

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
            'src/controllers/userController.js': `// Example controller with CRUD operations
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
            'src/config/index.js': `require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};`,
            '.env': `NODE_ENV=development
PORT=3000`,
            '.gitignore': `node_modules/
.env.local
.env.production
.DS_Store
*.log`,
            'package.json': (projectName) => `{
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
            'README.md': (projectName) => `# ${projectName}

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
    },
    express: {
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
            'src/server.js': `const express = require('express');
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
            '.gitignore': `node_modules/
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
            'README.md': (projectName) => `# ${projectName}

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
    },
};

// CLI Program setup
program
  .name('node-backend-gen')
  .description('Generate professional Node.js backend folder structures')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('Create a new Node.js backend project')
  .option('-t, --template <template>', 'Template to use (basic, express)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list-templates')
  .description('List available templates')
  .action(() => {
    console.log(chalk.blue('\nAvailable templates:\n'));
    Object.entries(templates).forEach(([key, template]) => {
      console.log(chalk.green(`  ${key}`), '-', template.name);
    });
    console.log();
  });

async function createProject(projectName, options) {
  // Validate project name
  if (!projectName || !/^[a-zA-Z0-9-_]+$/.test(projectName)) {
    throw new Error('Invalid project name. Use only letters, numbers, hyphens, and underscores.');
  }

  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${projectName}" already exists.`);
  }

  let selectedTemplate;
  let includeDocker = false;

  if (options.yes) {
    selectedTemplate = options.template || 'basic';
  } else {
    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: Object.entries(templates).map(([key, template]) => ({
          name: `${template.name} (${key})`,
          value: key
        })),
        default: options.template || 'basic'
      },
      {
        type: 'confirm',
        name: 'includeDocker',
        message: 'Include Docker configuration?',
        default: false
      }
    ]);

    selectedTemplate = answers.template;
    includeDocker = answers.includeDocker;
  }

  if (!templates[selectedTemplate]) {
    throw new Error(`Template "${selectedTemplate}" not found.`);
  }

  console.log(chalk.blue(`\nCreating project "${projectName}" with ${templates[selectedTemplate].name} template...\n`));

  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });

  // Create folder structure
  const template = templates[selectedTemplate];
  createFolders(projectPath, template.folders);

  // Create files
  createFiles(projectPath, template.files, projectName);

  // Add optional components
  if (includeDocker) {
    addDockerConfig(projectPath, selectedTemplate, projectName);
  }

  console.log(chalk.green('✅ Project created successfully!\n'));
  console.log(chalk.blue('Next steps:'));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white('  npm install'));
  console.log(chalk.white('  npm run dev\n'));
}

function createFolders(basePath, folders) {
  folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(chalk.gray(`Created folder: ${folder}`));
  });
}

function createFiles(basePath, files, projectName) {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(basePath, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Handle function-based content (for dynamic content like README and package.json)
    const fileContent = typeof content === 'function' ? content(projectName) : content;
    
    fs.writeFileSync(fullPath, fileContent);
    console.log(chalk.gray(`Created file: ${filePath}`));
  });
}

function addDockerConfig(projectPath, template, projectName) {
  const dockerfileContent = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`;

  const dockerignoreContent = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.*
coverage
.nyc_output`;

  const dockerComposeContent = `version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped`;

  // Update package.json to include Docker scripts
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    'docker:build': `docker build -t ${projectName} .`,
    'docker:run': `docker run -p 3000:3000 ${projectName}`,
    'docker:up': 'docker-compose up',
    'docker:down': 'docker-compose down'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectPath, 'Dockerfile'), dockerfileContent);
  fs.writeFileSync(path.join(projectPath, '.dockerignore'), dockerignoreContent);
  fs.writeFileSync(path.join(projectPath, 'docker-compose.yml'), dockerComposeContent);
  
  console.log(chalk.gray('Added Docker configuration'));
}

// Parse command line arguments
program.parse();

// Show help if no command provided
if (process.argv.length <= 2) {
  program.help();
}
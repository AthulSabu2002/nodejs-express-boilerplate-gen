#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');

// Import templates from dedicated module
const templates = require('./templates');

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
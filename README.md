# Node Backend Generator

A command-line tool to quickly scaffold professional Node.js backend applications with different templates.

## Installation

### Global Installation (Recommended)

```bash
npm install -g node-backend-generator
```

This makes the `node-backend-gen` command available globally on your system.

### Local Installation

```bash
npm install node-backend-generator
```

When installed locally, you'll need to use `npx` to run the commands.

## Usage

### Create a new project

```bash
# Using global installation
node-backend-gen create my-project

# Using npx with local installation
npx node-backend-generator create my-project
```

The tool will guide you through an interactive process to select a template and configure your project.

### Available Templates

You can list all available templates with:

```bash
node-backend-gen list-templates
```

Currently supported templates:

- **basic** - Basic REST API with Express.js

  - Minimal setup with Express.js
  - Ready-to-use CRUD API example
  - Environment configuration
  - Proper project structure

- **express** - Express with MongoDB integration
  - Express.js framework
  - MongoDB database connection
  - Mongoose ODM
  - Model-Controller architecture
  - Ready-to-use CRUD API example

### Command Options

#### Create Command

```bash
node-backend-gen create <project-name> [options]
```

Options:

- `-t, --template <template>` - Specify which template to use (basic, express)
- `-y, --yes` - Skip interactive prompts and use default options (no Docker)
- `-h, --help` - Display help information

Examples:

```bash
# Create a project with the basic template
node-backend-gen create my-api --template basic

# Create a project with express template, skipping prompts
node-backend-gen create my-mongo-api --template express -y

# Create a project and follow the interactive prompts
node-backend-gen create my-project
```

## Features

- **Multiple project templates** - Choose the right template for your needs
- **Interactive CLI** - Guided setup with prompts for project configuration
- **Optional Docker support** - Include Docker and docker-compose configuration if needed
- **Structured project architecture** - Professional folder organization following best practices
- **Ready-to-use API endpoints** - Example endpoints that work out of the box
- **Environment configuration** - Pre-configured .env files and environment handling

## Project Structure

### Basic Template

```
my-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── services/
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Express Template

```
my-mongo-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── services/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](file:///c%3A/Container/backend_dev/node-backend-generator/CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](file:///c%3A/Container/backend_dev/node-backend-generator/LICENSE) file for details.

# Nodejs-Expressjs-Boilerplate-Generator

A command-line tool to quickly scaffold professional Node.js backend applications with different templates.

## Installation

This tool is designed to be used locally after cloning and customizing to your needs.

```bash
# Clone the repository
git clone <repository-url> node-backend-generator
cd node-backend-generator

# Install dependencies
npm install

# Link the package locally
npm link
```

This makes the `node-backend-gen` command available on your system.

## Usage

### Create a new project

```bash
# After linking the package
create-node-api create my-project
```

The tool will guide you through an interactive process to select a template and configure your project.

### Available Templates

You can list all available templates with:

```bash
create-node-api list-templates
```

Currently supported templates:

- **basic** - Basic REST API with Express.js (JavaScript)

  - Minimal setup with Express.js
  - Ready-to-use CRUD API example
  - Environment configuration
  - Proper project structure

- **express** - Express with MongoDB integration (JavaScript)

  - Express.js framework
  - MongoDB database connection
  - Mongoose ODM
  - Model-Controller architecture
  - Ready-to-use CRUD API example

- **basic-ts** - TypeScript version of Basic REST API

  - TypeScript configuration
  - Type-safe Express.js setup
  - All features of basic template with type safety

- **express-ts** - TypeScript version of Express with MongoDB
  - TypeScript configuration
  - Type-safe Express.js and MongoDB integration
  - Interface definitions for models
  - All features of express template with type safety

### Command Options

#### Create Command

```bash
create-node-api create <project-name> [options]
```

Options:

- `-t, --template <template>` - Specify which template to use (basic, express, basic-ts, express-ts)
- `-y, --yes` - Skip interactive prompts and use default options (no Docker)
- `-h, --help` - Display help information

Examples:

```bash
# Create a project with the basic template
create-node-api create my-api --template basic

# Create a project with express TypeScript template
create-node-api create my-mongo-api --template tsexpress

# Create a project and follow the interactive prompts
create-node-api create my-project
```

## Features

- **Multiple project templates** - Choose the right template for your needs
- **JavaScript and TypeScript support** - Use either language based on your preference
- **Interactive CLI** - Guided setup with prompts for project configuration
- **Optional Docker support** - Include Docker and docker-compose configuration if needed
- **Structured project architecture** - Professional folder organization following best practices
- **Ready-to-use API endpoints** - Example endpoints that work out of the box
- **Environment configuration** - Pre-configured .env files and environment handling

## Project Structure

### Basic Template (JavaScript/TypeScript)

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

### Express Template (JavaScript/TypeScript)

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

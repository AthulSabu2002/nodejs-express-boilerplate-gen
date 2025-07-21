module.exports = {
    name: 'TypeScript Basic REST API',
    folders: [
        'src',
        'src/controllers',
        'src/routes',
        'src/middleware',
        'src/utils',
        'src/types',
    ],
    files: {
'src/middleware/logger.ts':`// Logger middleware
import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    
    // Process the request
    next();
    
    // Log after response is sent
    const responseTime = Date.now() - start;
    console.log(
        \`\${new Date().toLocaleString()} | \${req.method} \${req.url} | \${res.statusCode} | \${responseTime}ms\`
    );
};

export default logger;`,

'src/server.ts':`import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import logger from './middleware/logger';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api', routes);
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,

'src/routes/index.ts':`import express, { Router } from 'express';
import * as userController from '../controllers/userController';

const router: Router = express.Router();

// Example routes
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);

export default router;`,

'src/controllers/userController.ts':`// Example controller with CRUD operations
import { Request, Response } from 'express';
import { User } from '../types';

const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

export const getUsers = (req: Request, res: Response): void => {
    res.json(users);
};

export const getUserById = (req: Request, res: Response): void => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

export const createUser = (req: Request, res: Response): void => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const newUser: User = {
        id: users.length + 1,
        name,
        email
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
};`,

'src/types/index.ts':
`export interface User {
    id: number;
    name: string;
    email: string;
}`,

'tsconfig.json': 
`{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}`,

'.env': 
`NODE_ENV=development
PORT=3000`,

'.gitignore': 
`node_modules/
dist/
.env.local
.env.production
.DS_Store
*.log`,

'package.json': (projectName) =>`{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "TypeScript Node.js backend application",
    "main": "dist/server.js",
    "scripts": {
        "build": "tsc",
        "start": "node dist/server.js",
        "dev": "ts-node-dev --respawn src/server.ts",
        "postinstall": "npm run build"
    },
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1"
    },
    "devDependencies": {
        "@types/cors": "^2.8.15",
        "@types/express": "^4.17.20",
        "@types/node": "^20.8.9",
        "ts-node": "^10.9.1",
        "ts-node-dev": "^2.0.0",
        "typescript": "^5.2.2",
        "nodemon": "^3.0.1"
    }
}`,

'README.md': (projectName) => 
`# ${projectName}

## Installation
\`\`\`bash
npm install
\`\`\`

## Development
\`\`\`bash
npm run dev
\`\`\`

## Build
\`\`\`bash
npm run build
\`\`\`

## Production
\`\`\`bash
npm start
\`\`\`
`
    }
};

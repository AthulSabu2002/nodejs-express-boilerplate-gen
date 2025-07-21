module.exports = {
    name: 'TypeScript Express + MongoDB',
    folders: [
        'src',
        'src/controllers',
        'src/models',
        'src/routes',
        'src/middleware',
        'src/utils',
        'src/config',
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
import connectDB from './config/database';
import routes from './routes';
import logger from './middleware/logger';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Database connection
connectDB();

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

'src/controllers/userController.ts':`import { Request, Response } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ message: error.message });
    }
};`,

'src/models/User.ts':`import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema({
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

export default mongoose.model<IUser>('User', userSchema);`,

'src/types/index.ts':
`import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    createdAt: Date;
}`,

'src/config/database.ts': (projectName) =>`import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI: string = process.env.MONGODB_URI || \`mongodb://localhost:27017/${projectName}\`;
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectDB;`,

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

'.env': (projectName) =>`NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/${projectName}`,

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
    "description": "TypeScript Node.js backend with MongoDB",
    "main": "dist/server.js",
    "scripts": {
        "build": "tsc",
        "start": "node dist/server.js",
        "dev": "ts-node-dev --respawn src/server.ts",
        "postinstall": "npm run build"
    },
    "dependencies": {
        "express": "^4.18.2",
        "mongoose": "^7.5.0",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1"
    },
    "devDependencies": {
        "@types/cors": "^2.8.15",
        "@types/express": "^4.17.20",
        "@types/node": "^20.8.9",
        "@types/mongoose": "^5.11.97",
        "ts-node": "^10.9.1",
        "ts-node-dev": "^2.0.0",
        "typescript": "^5.2.2",
        "nodemon": "^3.0.1"
    }
}`,

'README.md': (projectName) =>`# ${projectName}

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

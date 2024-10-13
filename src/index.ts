// src/index.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { AppDataSource } from './db/data-source.db';
import parentRoutes from './routes/parent.routes';
import parentChildRoutes from './routes/parent-child.routes';
import userRoutes from './routes/user.routes';
import { apiLimiter } from './middlewares/rate-limiter.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { Config } from './configs/environment.config';
import authRoutes from './routes/auth.routes';
import childRoutes from './routes/child.routes';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        const app = express();

        app.use(express.json({ limit: '5mb' }));
        app.use(express.urlencoded({ extended: true, limit: '5mb' }));
        app.use(cors());
        app.use(morgan('dev'));
        app.use(helmet());
        app.use(apiLimiter);

        const apiUrl = Config.getApiUrl() || '/api/v1';

        const router = express.Router();

        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Daycare Express API',
                    version: '1.0.0',
                    description: 'API para gerenciar creches',
                },
                servers: [
                    {
                        url: apiUrl || '/api/v1',
                    },
                ],
            },
            apis: ['./src/routes/*.ts'], // Arquivos onde estão definidas as rotas
        };

        // Inicializando o Swagger com o swagger-jsdoc
        const swaggerDocs = swaggerJsdoc(swaggerOptions);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

        router.use('/auth', authRoutes);
        router.use('/users', userRoutes);
        router.use('/children', childRoutes);
        router.use('/parents', parentRoutes);
        router.use('/parent-child', parentChildRoutes);

        app.use(apiUrl, router);

        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'OK', uptime: process.uptime() });
        });

        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Our fault! Something happened server-side.' });
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Base URL: ${apiUrl}`);
        });
    })
    .catch((error) => console.log(error));
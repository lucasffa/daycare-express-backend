// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { AppDataSource } from '../db/data-source.db';
import { User } from '../entities/user.entity';

const authRoutes = Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * paths:
 *   /auth/login:
 *     post:
 *       summary: Realiza o login
 *       tags:
 *         - Autenticação
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "joao.silva@example.com"
 *                 password:
 *                   type: string
 *                   example: "Password123!"
 *       responses:
 *         200:
 *           description: Login bem-sucedido, retorna o token JWT e os dados do usuário
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Login successful"
 *                   response:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "42d13975-5a30-4641-9bae-57ffd6badb28"
 *                           username:
 *                             type: string
 *                             example: "joaosilva"
 *                           name:
 *                             type: string
 *                             example: "João da Silva"
 *                           lastLoginAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-13T00:10:38.297Z"
 *                       token:
 *                         type: string
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         400:
 *           description: Requisição inválida
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Validation failed"
 *                   errors:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Email is required"
 *         401:
 *           description: Credenciais inválidas
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid credentials"
 *         404:
 *           description: Usuário não encontrado ou inativo
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found or inactive"
 */
authRoutes.post('/login', (req, res) => authController.login(req, res));

export default authRoutes;
// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { AppDataSource } from '../db/data-source.db';
import { User } from '../entities/user.entity';
import { apiLimiter } from '../middlewares/rate-limiter.middleware';
import { ensureRole } from '../middlewares/ensure-roles.middleware';
import { UserRole } from '../enums/roles.enum';

const userRoutes = Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "João da Silva"
 *               username:
 *                 type: string
 *                 example: "joaosilva"
 *               email:
 *                 type: string
 *                 example: "joao.silva@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, STAFF, PARENT, RELATIVE]
 *                 example: "PARENT"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Requisição inválida
 */
userRoutes.post(
  '/',
  apiLimiter,
  (req, res) => {
    userController.create(req, res);
  }
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "f1b2c3d4-5678-9101-1121-314151617181"
 *                   fullName:
 *                     type: string
 *                     example: "João da Silva"
 *                   email:
 *                     type: string
 *                     example: "joao.silva@example.com"
 *                   role:
 *                     type: string
 *                     example: "PARENT"
 */
userRoutes.get(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.findAll(req, res);
  }
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário específico
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "f1b2c3d4-5678-9101-1121-314151617181"
 *                 fullName:
 *                   type: string
 *                   example: "João da Silva"
 *                 email:
 *                   type: string
 *                   example: "joao.silva@example.com"
 *                 role:
 *                   type: string
 *                   example: "PARENT"
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.get(
  '/:id',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => {
    userController.findOne(req, res);
  }
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário específico
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "João da Silva Atualizado"
 *               email:
 *                 type: string
 *                 example: "joao.silva.updated@example.com"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.put(
  '/:id',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.update(req, res);
  }
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui (soft-delete) um usuário específico
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.delete(
  '/:id',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.softDelete(req, res);
  }
);

/**
 * @swagger
 * /users/{id}/toggle-activate:
 *   patch:
 *     summary: Alterna o estado de ativação do usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Estado de ativação alterado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.patch(
  '/:id/toggle-activate',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.toggleActivate(req, res);
  }
);

export default userRoutes;
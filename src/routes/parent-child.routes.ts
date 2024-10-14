// src/routes/parent-child.routes.ts
import { Router } from 'express';
import { ParentChildService } from '../services/parent-child.service';
import { ParentChildController } from '../controllers/parent-child.controller';
import { AppDataSource } from '../db/data-source.db';
import { ParentChild } from '../entities/parent-child.entity';
import { apiLimiter } from '../middlewares/rate-limiter.middleware';
import { ensureRole } from '../middlewares/ensure-roles.middleware';
import { UserRole } from '../enums/roles.enum';
import { Parent } from '../entities/parent.entity';
import { Child } from '../entities/child.entity';

const parentChildRoutes = Router();

const parentChildRepository = AppDataSource.getRepository(ParentChild);
const parentRepository = AppDataSource.getRepository(Parent);
const childRepository = AppDataSource.getRepository(Child);

const parentChildService = new ParentChildService(parentChildRepository, parentRepository, childRepository);
const parentChildController = new ParentChildController(parentChildService);

/**
 * @swagger
 * /parent-child:
 *   post:
 *     summary: Cria uma guarda de Pai-Filho
 *     tags:
 *       - Guarda Pai-Filho
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentId:
 *                 type: string
 *                 example: "c1b2c3d4-5678-9101-1121-314151617181"
 *               childId:
 *                 type: string
 *                 example: "d1e2f3g4-5678-9101-1121-415161718192"
 *               guardianshipType:
 *                 type: string
 *                 enum: [shared, unilateral]
 *                 example: "shared"
 *               kinshipDegree:
 *                 type: string
 *                 example: "Pai"
 *               additionalInfo:
 *                 type: string
 *                 example: "Pai tem guarda compartilhada."
 *               isAuthorizedToPickup:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Relacionamento criado com sucesso
 *       400:
 *         description: Requisição inválida
 */
parentChildRoutes.post(
    '/',
    apiLimiter,
    ensureRole([UserRole.ADMIN, UserRole.STAFF]),
    (req, res) => parentChildController.create(req, res)
);


/**
 * @swagger
 * /parent-child/search:
 *   get:
 *     summary: Busca a guarda de um pai ou criança usando CPF ou nome do pai
 *     tags:
 *       - Guarda Pai-Filho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         required: false
 *         description: CPF do pai ou da criança no formato XXX.XXX.XXX-XX
 *       - in: query
 *         name: parentName
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome do pai (mínimo de 5 caracteres)
 *     responses:
 *       200:
 *         description: Lista de guardas encontradas
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Nenhum registro encontrado para o CPF ou nome fornecido
 */
parentChildRoutes.get(
    '/search',
    apiLimiter,
    ensureRole([UserRole.ADMIN, UserRole.STAFF]),
    (req, res) => parentChildController.find(req, res)
  );

export default parentChildRoutes;
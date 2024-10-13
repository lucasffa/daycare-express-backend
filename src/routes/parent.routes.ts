// src/routes/parent.routes.ts
import { Router } from 'express';
import { ParentController } from '../controllers/parent.controller';
import { ParentService } from '../services/parent.service';
import { AppDataSource } from '../db/data-source.db';
import { Parent } from '../entities/parent.entity';
import { apiLimiter } from '../middlewares/rate-limiter.middleware';
import { ensureRole } from '../middlewares/ensure-roles.middleware';
import { UserRole } from '../enums/roles.enum';

const parentRoutes = Router();

const parentRepository = AppDataSource.getRepository(Parent);
const parentService = new ParentService(parentRepository);
const parentController = new ParentController(parentService);


/**
 * @swagger
 * /parents:
 *   post:
 *     summary: Cria um novo cadastro de pais ou responsáveis
 *     tags:
 *       - Pais
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "João Silva"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               rg:
 *                 type: string
 *                 example: "MG-12.345.678"
 *               address:
 *                 type: string
 *                 example: "Rua das Flores, 123, Centro"
 *               primaryPhone:
 *                 type: string
 *                 example: "(31) 99999-9999"
 *               secondaryPhone:
 *                 type: string
 *                 example: "(31) 98888-8888"
 *               profession:
 *                 type: string
 *                 example: "Engenheiro"
 *               workplace:
 *                 type: string
 *                 example: "ABC Engenharia"
 *               email:
 *                 type: string
 *                 example: "joao.silva@example.com"
 *               photo:
 *                 type: string
 *                 example: "https://link-para-foto.com/joao-silva.jpg"
 *     responses:
 *       201:
 *         description: Pai ou responsável criado com sucesso
 *       400:
 *         description: Requisição inválida
 */

parentRoutes.post(
    '/',
    apiLimiter,
    ensureRole([UserRole.ADMIN, UserRole.STAFF]),
    (req, res) => parentController.create(req, res)
);

export default parentRoutes;
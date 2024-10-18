// src/routes/accountant.routes.ts
import { Router } from "express";
import { AppDataSource } from "../db/data-source.db";
import { apiLimiter } from "../middlewares/rate-limiter.middleware";
import { AccountantService } from "../services/accountant.service";
import { AccountantController } from "../controllers/accountant.controller";
import { Accountant } from "../entities/accountant.entity";

const accountantRoutes = Router();
const accountantRepository = AppDataSource.getRepository(Accountant);
const accountantService = new AccountantService(accountantRepository);
const accountantController = new AccountantController(accountantService);

/**
 * @swagger
 * /accountant:
 *   post:
 *     summary: Cria um novo contador
 *     tags:
 *       - Contadores
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Paulo contador de axilas"
 *               crc:
 *                 type: string
 *                 example: "MG-123456"
 *               cpf:
 *                 type: string
 *                 example: "635.975.050-31"
 *               rg:
 *                 type: string
 *                 example: "MG-12.345.678"
 *               primaryPhone:
 *                 type: string
 *                 example: "(31) 99999-9999"
 *               secondaryPhone:
 *                 type: string
 *                 example: "(31) 98888-8888"
 *               email:
 *                 type: string
 *                 example: "paulo.axilas@example.com"
 *     responses:
 *       201:
 *         description: Contador criado com sucesso
 *       400:
 *         description: Requisição inválida
 *       409:
 *         description: Conflito com objeto pré-registrado ou pré-existente
 */

accountantRoutes.post("/", apiLimiter, (req, res) => {
  accountantController.create(req, res);
});

export default accountantRoutes;
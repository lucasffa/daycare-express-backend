import { Router } from "express";
import { AppDataSource } from "../db/data-source.db";
import { ChildPickupGuardianService } from "../services/childPickupGuardian.service";
import { ChildPickupGuardianController } from "../controllers/childPickupGuardian.controller";
import { ChildPickupGuardian } from "../entities/childPickupGuardian.entity";
import { apiLimiter } from "../middlewares/rate-limiter.middleware";
import { ensureRole } from "../middlewares/ensure-roles.middleware";
import { UserRole } from "../enums/roles.enum";
import { Child } from "../entities/child.entity";

const childPickupGuardianRoutes = Router();

const childPickupGuardianRepository = AppDataSource.getRepository(ChildPickupGuardian);
const childRepository = AppDataSource.getRepository(Child);

const childPickupGuardianService = new ChildPickupGuardianService(
  childPickupGuardianRepository,
  childRepository
);
const childPickupGuardianController = new ChildPickupGuardianController(
  childPickupGuardianService
);

/**
 * @swagger
 * /child-pickup-guardians:
 *   post:
 *     summary: Cria um novo responsável por buscar a criança
 *     tags:
 *       - Responsáveis por buscar a criança
 *     security:
 *       - bearerAuth: []
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
 *                 example: "949.516.000-64"
 *               rg:
 *                 type: string
 *                 example: "MG-12.345.678"
 *               relationship:
 *                 type: string
 *                 example: "Tio"
 *               phone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               email:
 *                 type: string
 *                 example: "joao.silva@example.com"
 *               hourToPickup:
 *                 type: string
 *                 example: "17:00"
 *               parentalConsent:
 *                 type: string
 *                 example: "https://link-para-foto.com/autorizacao-pai-por-escrito.jpg"
 *               childId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Responsável por buscar a criança criado com sucesso
 *       400:
 *         description: CPF inválido
 */

childPickupGuardianRoutes.post(
  "/",
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => childPickupGuardianController.create(req, res)
);

/**
 * @swagger
 * /child-pickup-guardians/{id}/remove-authorization-to-pickup:
 *   post:
 *     summary: Remove a autorização de um responsável por buscar a criança
 *     tags:
 *       - Responsáveis por buscar a criança
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retirado a autorização do responsável por buscar a criança
 *       404:
 *         description: Responsável por buscar a criança não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

childPickupGuardianRoutes.post(
  "/:id/remove-authorization-to-pickup",
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => childPickupGuardianController.RemoveAuthorization(req, res)
);

export default childPickupGuardianRoutes;

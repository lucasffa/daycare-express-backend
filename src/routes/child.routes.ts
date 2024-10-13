import { Router } from "express";
import { ChildController } from "../controllers/child.controller";
import { ChildService } from "../services/child.service";
import { AppDataSource } from "../db/data-source.db";
import { Child } from "../entities/child.entity";
import { apiLimiter } from "../middlewares/rate-limiter.middleware";
import { ensureRole } from "../middlewares/ensure-roles.middleware";
import { UserRole } from "../enums/roles.enum";

const childRoutes = Router();

const childRepository = AppDataSource.getRepository(Child);
const childService = new ChildService(childRepository);
const childController = new ChildController(childService);

/**
 * @swagger
 * /children:
 *   post:
 *     summary: Cria um novo cadastro de criança
 *     tags:
 *       - Crianças
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Maria Silva"
 *               birthDate:
 *                 type: string
 *                 example: "2015-06-01"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               address:
 *                 type: string
 *                 example: "Rua das Flores, 123, Centro"
 *               medicalInfo:
 *                 type: string
 *                 example: "Alergia a linguagem de programação"
 *               photo:
 *                 type: string
 *                 example: "https://link-para-foto.com/maria-silva.jpg"
 *               imageUsePermission:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Criança criada com sucesso
 *       400:
 *         description: Requisição inválida
 */

childRoutes.post(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => childController.create(req, res)
);

/**
 * @swagger
 * /children:
 *   get:
 *     summary: Buscando as crianças por nome, CPF ou data de nascimento
 *     tags:
 *       - Crianças
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome da criança
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: CPF da criança
 *       - in: query
 *         name: birthDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de nascimento da criança
 *     responses:
 *       200:
 *         description: Lista de crianças encontradas
 *       404:
 *         description: Nenhuma criança encontrada
 *       500:
 *         description: Erro interno do servidor
 */

childRoutes.get(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => childController.findChildren(req, res)
);

export default childRoutes;
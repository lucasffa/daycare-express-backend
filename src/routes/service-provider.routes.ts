import { Router } from 'express';
import { AppDataSource } from '../db/data-source.db';
import { ServiceProvider } from '../entities/service-provider.entity';
import { ServiceProviderService } from '../services/service-provider.service';
import { ServiceProviderController } from '../controllers/service-provider.controller';
import { apiLimiter } from '../middlewares/rate-limiter.middleware';
import { UserRole } from '../enums/roles.enum';
import { ensureRole } from '../middlewares/ensure-roles.middleware';

const serviceProviderRoutes = Router();

const serviceProviderRepository = AppDataSource.getRepository(ServiceProvider);
const serviceProviderService = new ServiceProviderService(
  serviceProviderRepository
);
const serviceProviderController = new ServiceProviderController(
  serviceProviderService
);

/**
 * @swagger
 * /service-providers:
 *   post:
 *     summary: Cria um novo cadastro de prestador de serviço
 *     tags:
 *       - Prestadores de Serviço
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
 *                 example: "João da Silva"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1985-07-22"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               rg:
 *                 type: string
 *                 example: "MG-12.345.678"
 *               address:
 *                 type: string
 *                 example: "Av. Central, 456, Centro"
 *               phone:
 *                 type: string
 *                 example: "(31) 98765-4321"
 *               photo:
 *                 type: string
 *                 example: "https://link-para-foto.com/joao-silva.jpg"
 *               archiveCurriculum:
 *                 type: string
 *                 example: "https://link-para-curriculo.com/curriculo.pdf"
 *               dateOfHire:
 *                 type: string
 *                 format: date
 *                 example: "2023-05-15"
 *               jobTitle:
 *                 type: string
 *                 example: "Eletricista"
 *               numberCpts:
 *                 type: string
 *                 example: "123456"
 *               previousWorkExperience:
 *                 type: string
 *                 example: "10 anos em manutenção elétrica"
 *               certifications:
 *                 type: string
 *                 example: "Certificação NR10, NR35"
 *               coursesCompleted:
 *                 type: string
 *                 example: "Curso de Eletricista Predial"
 *     responses:
 *       201:
 *         description: Prestador de serviço criado com sucesso
 *       400:
 *         description: Requisição inválida
 */
serviceProviderRoutes.post(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => serviceProviderController.create(req, res)
);

/**
 * @swagger
 * /service-providers/{id}/termination:
 *   post:
 *     summary: Desativa um prestador de serviço
 *     tags:
 *       - Prestadores de Serviço
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do prestador de serviço
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               terminationMessage:
 *                 type: string
 *                 example: "Desativado por não cumprimento de contrato"
 *     responses:
 *       200:
 *         description: Prestador de serviço desativado com sucesso
 *       404:
 *         description: Prestador de serviço não encontrado
 */

serviceProviderRoutes.post(
  '/:id/termination',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => serviceProviderController.providerTermination(req, res)
);

export default serviceProviderRoutes;

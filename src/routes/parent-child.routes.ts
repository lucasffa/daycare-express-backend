// src/routes/parent-child.routes.ts
import { Router } from 'express';
import { ParentChildService } from '../services/parent-child.service';
import { ParentChildController } from '../controllers/parent-child.controller';
import { AppDataSource } from '../db/data-source.db';
import { Parent } from '../entities/parent.entity';
import { apiLimiter } from '../middlewares/rate-limiter.middleware';
import { ensureRole } from '../middlewares/ensure-roles.middleware';
import { UserRole } from '../enums/roles.enum';
import { ParentChild } from '../entities/parent-child.entity';

const parentChildRoutes = Router();

const parentChildRepository = AppDataSource.getRepository(ParentChild);
const parentChildService = new ParentChildService(parentChildRepository);
const parentController = new ParentChildController(parentChildService);

parentChildRoutes.post(
    '/',
    apiLimiter,
    ensureRole([UserRole.ADMIN, UserRole.STAFF]),
    (req, res) => parentController.create(req, res)
);

export default parentChildRoutes;
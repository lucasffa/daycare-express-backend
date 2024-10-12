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

parentRoutes.post(
    '/',
    apiLimiter,
    ensureRole([UserRole.ADMIN, UserRole.STAFF]),
    (req, res) => parentController.create(req, res)
);

export default parentRoutes;
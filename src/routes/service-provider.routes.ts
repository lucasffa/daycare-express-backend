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

serviceProviderRoutes.post(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => serviceProviderController.create(req, res)
);

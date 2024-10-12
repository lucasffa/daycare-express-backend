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

userRoutes.post(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.create(req, res);
  }
);

userRoutes.get(
  '/',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.findAll(req, res);
  }
);

userRoutes.get(
  '/:id',
  apiLimiter,
  ensureRole([UserRole.ADMIN, UserRole.STAFF]),
  (req, res) => {
    userController.findOne(req, res);
  }
);

userRoutes.put(
  '/:id',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.update(req, res);
  }
);

userRoutes.delete(
  '/:id',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.softDelete(req, res);
  }
);

userRoutes.patch(
  '/:id/toggle-activate',
  apiLimiter,
  ensureRole([UserRole.ADMIN]),
  (req, res) => {
    userController.toggleActivate(req, res);
  }
);

export default userRoutes;
// src/controllers/ParentChildController.ts
import { Request, Response } from 'express';
import { ParentChildService } from '../services/parent-child.service';
import { CreateParentChildDTO } from '../dtos/create-parent-child.dto';
import { validate } from 'class-validator';

export class ParentChildController {
  private parentChildService: ParentChildService;

  constructor(parentChildService: ParentChildService) {
    this.parentChildService = parentChildService;
  }

  async create(req: Request, res: Response) {
    const data = req.body;

    const dto = new CreateParentChildDTO();
    Object.assign(dto, data);

    validate(dto)
      .then((errors) => {
        if (errors.length > 0) {
          return Promise.reject({ status: 400, message: errors });
        } else {
          return this.parentChildService.create(dto);
        }
      })
      .then((parentChild) => {
        res.status(201).json({ message: 'Parent-Child relationship created successfully', data: parentChild });
      })
      .catch((error) => {
        if (error.status) {
          res.status(error.status).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal Server Error', error });
        }
      });
  }
}
// src/controllers/ParentController.ts
import { Request, Response } from 'express';
import { ParentService } from '../services/parent.service';
import { CreateParentDTO } from '../dtos/create-parent.dto';
import { validate } from 'class-validator';

export class ParentController {
  private parentService: ParentService;

  constructor(parentService: ParentService) {
    this.parentService = parentService;
  }

  async create(req: Request, res: Response) {
    const data = req.body;

    const dto = new CreateParentDTO();
    Object.assign(dto, data);

    validate(dto)
      .then((errors) => {
        if (errors.length > 0) {
          return Promise.reject({ status: 400, message: errors });
        } else {
          return this.parentService.create(dto);
        }
      })
      .then((parent) => {
        res.status(201).json({ message: 'Parent created successfully', data: parent });
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
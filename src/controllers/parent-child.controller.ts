// src/controllers/ParentChildController.ts
import { Request, Response } from 'express';
import { ParentChildService } from '../services/parent-child.service';
import { CreateParentChildDTO } from '../dtos/create-parent-child.dto';
import { validate } from 'class-validator';
import { CpfSearchDTO } from '../dtos/cpf-search.dto';
import { NameSearchDTO } from '../dtos/name-search.dto';

export class ParentChildController {
  private parentChildService: ParentChildService;

  constructor(parentChildService: ParentChildService) {
    this.parentChildService = parentChildService;
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = req.body;

    const dto = new CreateParentChildDTO();
    Object.assign(dto, data);

    try {
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ message: errors });
        return;
      }

      const parentChild = await this.parentChildService.create(dto);
      res.status(201).json({ message: 'Parent-Child relationship created successfully', data: parentChild });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  async find(req: Request, res: Response): Promise<void> {
    const { cpf, parentName } = req.query;

    console.log("parentName on find on parentchildcontroller: ", parentName);

    if (cpf) {
      const dto = new CpfSearchDTO();
      dto.cpf = cpf as string;

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Invalid CPF format', errors });
        return;
      }

      try {
        const result = await this.parentChildService.findByCpf(dto.cpf, req.user.role);
        res.status(200).json(result);
        return;
      } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
        return;
      }
    }

    if (parentName) {
      const dto = new NameSearchDTO();
      dto.parentName = parentName as string;

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Invalid name format', errors });
        return;
      }

      try {
        const result = await this.parentChildService.findByParentName(dto.parentName, req.user.role);
        res.status(200).json(result);
        return;
      } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
        return;
      }
    }

    res.status(400).json({ message: 'You must provide either a CPF or a parent name' });
  }
}
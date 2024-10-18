// src/controllers/accountant.controller.ts
import { Request, Response } from "express";
import { AccountantService } from "../services/accountant.service";
import { CreateAccountantDTO } from "../dtos/create-accountant.dto";
import { validate } from "class-validator";

export class AccountantController {
  private accountantService: AccountantService;

  constructor(accountantService: AccountantService) {
    this.accountantService = accountantService;
  }

  async create(req: Request, res: Response) {
    const data = req.body;

    const dto = new CreateAccountantDTO();
    Object.assign(dto, data);

    validate(dto)
      .then((errors) => {
        if (errors.length > 0) {
          return Promise.reject({ status: 400, message: errors });
        } else {
          return this.accountantService.create(dto);
        }
      })
      .then((parent) => {
        res.status(201).json({ message: 'Accountant created successfully', data: parent });
      })
      .catch((error) => {
        if (error.status) {
          res.status(error.status).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal Server Error', error });
        }
      });
  }}
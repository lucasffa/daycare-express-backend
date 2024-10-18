// src/services/accountant.service.ts
import { Repository } from "typeorm";
import { CreateAccountantDTO } from "../dtos/create-accountant.dto";
import { Accountant } from "../entities/accountant.entity";

export class AccountantService {
  private accountantRepository: Repository<Accountant>;

  constructor(accountantRepository: Repository<Accountant>) {
    this.accountantRepository = accountantRepository;
  }

  async create(data: CreateAccountantDTO): Promise<Accountant> {
    
    const accountant = this.accountantRepository.create(data);
    return this.accountantRepository
    .save(accountant)
    .then((savedAccountant) => {
      return Promise.resolve(savedAccountant);
    })
    .catch((error) => {
      if (error.code === '23505') {
        return Promise.reject({ status: 409, message: 'CPF already exists' });
      }
      return Promise.reject({ status: 500, message: 'Failed to save accountant', error });
    });
}}
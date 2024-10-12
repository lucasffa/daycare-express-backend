// src/services/ParentChildService.ts
import { Repository } from 'typeorm';
import { ParentChild } from '../entities/parent-child.entity';
import { CreateParentChildDTO } from '../dtos/create-parent-child.dto';

export class ParentChildService {
  private parentChildRepository: Repository<ParentChild>;

  constructor(parentChildRepository: Repository<ParentChild>) {
    this.parentChildRepository = parentChildRepository;
  }

  create(data: CreateParentChildDTO): Promise<ParentChild> {
    const parentChild = this.parentChildRepository.create(data);
    return this.parentChildRepository
      .save(parentChild)
      .then((savedParentChild) => {
        return Promise.resolve(savedParentChild);
      })
      .catch((error) => {
        return Promise.reject({ status: 500, message: 'Failed to save parent-child relationship', error });
      });
  }
}
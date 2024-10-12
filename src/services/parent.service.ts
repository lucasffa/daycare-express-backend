// src/services/ParentService.ts
import { Repository } from 'typeorm';
import { Parent } from '../entities/parent.entity';
import { CreateParentDTO } from '../dtos/create-parent.dto';

export class ParentService {
  private parentRepository: Repository<Parent>;

  constructor(parentRepository: Repository<Parent>) {
    this.parentRepository = parentRepository;
  }

  create(data: CreateParentDTO): Promise<Parent> {
    const parent = this.parentRepository.create(data);
    return this.parentRepository
      .save(parent)
      .then((savedParent) => {
        return Promise.resolve(savedParent);
      })
      .catch((error) => {
        return Promise.reject({ status: 500, message: 'Failed to save parent', error });
      });
  }
}
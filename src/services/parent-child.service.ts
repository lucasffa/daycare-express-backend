// src/services/ParentChildService.ts
import { ILike, Repository } from 'typeorm';
import { ParentChild } from '../entities/parent-child.entity';
import { CreateParentChildDTO } from '../dtos/create-parent-child.dto';
import { Parent } from '../entities/parent.entity';
import { Child } from '../entities/child.entity';
import { ParentChildResponseDTO } from '../dtos/parent-child-response.dto';
import { plainToInstance } from 'class-transformer';

export class ParentChildService {
  private parentChildRepository: Repository<ParentChild>;
  private parentRepository: Repository<Parent>;
  private childRepository: Repository<Child>;

  constructor(
    parentChildRepository: Repository<ParentChild>,
    parentRepository: Repository<Parent>,
    childRepository: Repository<Child>
  ) {
    this.parentChildRepository = parentChildRepository;
    this.parentRepository = parentRepository;
    this.childRepository = childRepository;
  }

  async create(data: CreateParentChildDTO): Promise<ParentChild> {
    try {
      const parent = await this.parentRepository.findOne({ where: { id: data.parentId } });
      const child = await this.childRepository.findOne({ where: { id: data.childId } });

      if (!parent) {
        return Promise.reject({ status: 404, message: 'Parent not found' });
      }

      if (!child) {
        return Promise.reject({ status: 404, message: 'Child not found' });
      }

      const parentChild = this.parentChildRepository.create({
        ...data,
        parent,
        child
      });

      return this.parentChildRepository
        .save(parentChild)
        .then((savedParentChild) => {
          return Promise.resolve(savedParentChild);
        })
        .catch((error) => {
          return Promise.reject({ status: 500, message: 'Failed to save parent-child relationship', error });
        });
    } catch (error) {
      console.error("Erro ao salvar a relação parent-child: ", error);
      return Promise.reject({ status: 500, message: 'Failed to save parent-child relationship', error });
    }
  }

  async findByCpf(cpf: string): Promise<ParentChildResponseDTO[]> {
    const parent = await this.parentRepository.findOne({ where: { cpf } });
    const child = await this.childRepository.findOne({ where: { cpf } });

    if (!parent && !child) {
      return Promise.reject({ status: 404, message: 'No records found for the given CPF' });
    }

    const where: any = {};
    if (parent) {
      where.parent = parent;
    }
    if (child) {
      where.child = child;
    }

    const parentChildRelations = await this.parentChildRepository.find({
      where,
      relations: ['parent', 'child'],
    });

    return plainToInstance(ParentChildResponseDTO, parentChildRelations);
  }

  async findByParentName(name: string): Promise<ParentChildResponseDTO[]> {
    const parent = await this.parentRepository.findOne({ where: { fullName: ILike(`%${name}%`) } });

    if (!parent) {
      return Promise.reject({ status: 404, message: 'Parent not found with the given name' });
    }

    const parentChildRelations = await this.parentChildRepository.find({
      where: { parent },
      relations: ['parent', 'child'],
    });

    return plainToInstance(ParentChildResponseDTO, parentChildRelations);
  }
}
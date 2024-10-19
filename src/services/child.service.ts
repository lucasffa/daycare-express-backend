import { Repository, ILike } from "typeorm";
import { Child } from "../entities/child.entity";
import { CreateChildDTO } from "../dtos/create-child.dto";
import { plainToInstance } from "class-transformer";
import { isValidCpf } from "../utils/cpf.util";
import { ChildResponseDTO } from "../dtos/child-response.dto";
import { UserRole } from "../enums/roles.enum";

export class ChildService {
  private childRepository: Repository<Child>;

  constructor(childRepository: Repository<Child>) {
    this.childRepository = childRepository;
  }

  async create(data: CreateChildDTO): Promise<ChildResponseDTO> {
    const formattedCpf = this.normalizeAndFormatCpf(data.cpf);

    if (!isValidCpf(formattedCpf)) {
      return Promise.reject({ status: 400, message: "Invalid CPF" });
    }

    const existingChild = await this.childRepository.findOne({
      where: { cpf: formattedCpf },
    });

    if (existingChild) {
      return Promise.reject({ status: 400, message: "CPF already exists" });
    }

    const child = this.childRepository.create(data);

    return this.childRepository
      .save(child)
      .then((savedChild) => {
        return Promise.resolve(plainToInstance(ChildResponseDTO, savedChild));
      })
      .catch((error) => {
        return Promise.reject({
          status: 500,
          message: "Failed to save child",
          error,
        });
      });
  }

  async searchChildren(
    name?: string,
    cpf?: string,
    birthDate?: string,
    userRole?: UserRole
  ): Promise<ChildResponseDTO[] | null> {
    const where: any = {};

    if (name) {
      where.fullName = ILike(`%${name}%`);
    }

    if (cpf) {
      where.cpf = this.normalizeAndFormatCpf(cpf);
    }

    if (birthDate) {
      where.birthDate = birthDate;
    }

    const children = await this.childRepository.find({ where });

    if (userRole === UserRole.ACCOUNTANT) {
      children.forEach((child) => {
        child.cpf = "***********";
        child.address = "***********";
      });
    }

    return children.length > 0
      ? plainToInstance(ChildResponseDTO, children)
      : null;
  }

  private normalizeAndFormatCpf(cpf: string): string {
    const normalizedCpf = cpf.replace(/[\.\-]/g, "");
    return normalizedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
}

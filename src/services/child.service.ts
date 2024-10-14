import { Repository, ILike } from "typeorm";
import { Child } from "../entities/child.entity";
import { CreateChildDTO } from "../dtos/create-child.dto";
import { plainToInstance } from "class-transformer";

export class ChildService {
  private childRepository: Repository<Child>;

  constructor(childRepository: Repository<Child>) {
    this.childRepository = childRepository;
  }

  async create(data: CreateChildDTO): Promise<Child> {

    //Verificando se já existe uma criança com o CPF informado
    const formattedCpf = this.normalizeAndFormatCpf(data.cpf);
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
        return Promise.resolve(savedChild);
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
    birthDate?: string
  ): Promise<CreateChildDTO[] | null> {
    const where: any = {};

    if (name) {
      //Usando o ILike para deixar a busca case-insensitive no banco
      where.fullName = ILike(`%${name}%`);
    }

    if (cpf) {
      where.cpf = this.normalizeAndFormatCpf(cpf);
    }

    if (birthDate) {
      where.birthDate = birthDate;
    }

    const children = await this.childRepository.find({ where });
    return children.length > 0
      ? plainToInstance(CreateChildDTO, children)
      : null;
  }

  //Normalizando o CPF para o formato XXX.XXX.XXX-XX
  private normalizeAndFormatCpf(cpf: string): string {
    const normalizedCpf = cpf.replace(/[\.\-]/g, "");
    return normalizedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
}

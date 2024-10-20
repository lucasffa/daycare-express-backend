import { Repository } from "typeorm";
import { ChildPickupGuardian } from "../entities/childPickupGuardian.entity";
import { CreateChildPickupGuardianDTO } from "../dtos/create-childPickupGuardian.dto";
import { isValidCpf } from "../utils/cpf.util";
import { Child } from "../entities/child.entity";

export class ChildPickupGuardianService {
  private childPickupGuardianRepository: Repository<ChildPickupGuardian>;
  private childRepository: Repository<Child>;

  constructor(
    childPickupGuardianRepository: Repository<ChildPickupGuardian>,
    childRepository: Repository<Child>
  ) {
    this.childRepository = childRepository;
    this.childPickupGuardianRepository = childPickupGuardianRepository;
  }

  async create(
    data: CreateChildPickupGuardianDTO
  ): Promise<ChildPickupGuardian> {
    try {
      const formattedCpf = this.normalizeAndFormatCpf(data.cpf);
      const child = await this.childRepository.findOne({
        where: { id: data.childId },
      });

      if (!isValidCpf(formattedCpf)) {
        return Promise.reject({ status: 400, message: "Invalid CPF" });
      }

      if (!child) {
        return Promise.reject({ status: 404, message: "Child not found" });
      }

      const childPickupGuardian = this.childPickupGuardianRepository.create({
        ...data,
        cpf: formattedCpf,
        child,
      });

      return this.childPickupGuardianRepository
        .save(childPickupGuardian)
        .then((savedChildPickupGuardian) => {
          return Promise.resolve(savedChildPickupGuardian);
        })
        .catch((error) => {
          return Promise.reject({
            status: 500,
            message: "Failed to save childPickupGuardian",
            error,
          });
        });
    } catch (error) {
      console.error("Erro ao salvar a relação parent-child: ", error);
      return Promise.reject({
        status: 500,
        message: "Failed to save parent-child relationship",
        error,
      });
    }
  }

  async RemoveAuthorization(id: string): Promise<ChildPickupGuardian> {
    try {
      const childPickupGuardian =
        await this.childPickupGuardianRepository.findOne({ where: { id } });

      if (!childPickupGuardian) {
        return Promise.reject({
          status: 404,
          message: "Child pickup guardian not found",
        });
      }

      childPickupGuardian.isAuthorizedToPickup = false;

      return this.childPickupGuardianRepository.save(childPickupGuardian);
    } catch (error) {
      console.error("Error to find a child pickup guardian: ", error);
      return Promise.reject({
        status: 500,
        message: "Failed to fetch child pickup guardian",
        error,
      });
    }
  }

  normalizeAndFormatCpf(cpf: string): string {
    const normalizedCpf = cpf.replace(/[\.\-]/g, "");
    return normalizedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
}

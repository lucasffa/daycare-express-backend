import { Repository } from "typeorm";
import { ServiceProvider } from "../entities/service-provider.entity";
import { isValidCpf } from "../utils/cpf.util";
import { CreateServiceProviderDTO } from "../dtos/create-service-provider.dto";
import { ServiceProvidersResponseDTO } from "../dtos/service-provider-response.dto";
import { plainToInstance } from "class-transformer";
import { normalizeAndFormatCpf } from "../utils/normalizeAndFormatCpf.util";

export class ServiceProviderService {
  private serviceProviderRepository: Repository<ServiceProvider>;

  constructor(serviceProviderRepository: Repository<ServiceProvider>) {
    this.serviceProviderRepository = serviceProviderRepository;
  }

  async create(
    data: CreateServiceProviderDTO
  ): Promise<ServiceProvidersResponseDTO> {
    const formattedCpf = normalizeAndFormatCpf(data.cpf);

    if (!isValidCpf(formattedCpf)) {
      return Promise.reject({ status: 400, message: "Invalid CPF" });
    }

    const existingServiceProvider =
      await this.serviceProviderRepository.findOne({
        where: { cpf: formattedCpf },
      });

    if (existingServiceProvider) {
      return Promise.reject({ status: 400, message: "CPF already exists" });
    }

    const serviceProvider = this.serviceProviderRepository.create({
      ...data,
      cpf: formattedCpf,
    });

    return this.serviceProviderRepository
      .save(serviceProvider)
      .then((savedServiceProvider) => {
        return Promise.resolve(
          plainToInstance(ServiceProvidersResponseDTO, savedServiceProvider)
        );
      })
      .catch((error) => {
        return Promise.reject({
          status: 500,
          message: "Failed to save service provider",
          error,
        });
      });
  }

  async providerTermination(
    id: string,
    terminationMessage: string
  ): Promise<ServiceProvidersResponseDTO> {
    try {
      const serviceProvider = await this.serviceProviderRepository.findOne({
        where: { id },
      });

      if (!serviceProvider) {
        return Promise.reject({
          status: 404,
          message: "Service provider not found",
        });
      }

      serviceProvider.isActive = false;
      serviceProvider.terminationMessage = terminationMessage;

      const savedServiceProvider = await this.serviceProviderRepository.save(
        serviceProvider
      );
      return plainToInstance(ServiceProvidersResponseDTO, savedServiceProvider);
    } catch (error) {
      console.error("Error to terminate service provider: ", error);
      return Promise.reject({
        status: 500,
        message: "Failed to terminate service provider",
        error,
      });
    }
  }
}

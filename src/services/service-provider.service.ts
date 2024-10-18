import { Repository } from 'typeorm';
import { ServiceProvider } from '../entities/service-provider.entity';
import { isValidCpf } from '../utils/cpf.util';
import { CreateServiceProviderDTO } from '../dtos/create-service-provider.dto';
import { ServiceProvidersResponseDTO } from '../dtos/service-provider-response.dto';
import { plainToInstance } from 'class-transformer';

export class ServiceProviderService {
  private serviceProviderRepository: Repository<ServiceProvider>;

  constructor(serviceProviderRepository: Repository<ServiceProvider>) {
    this.serviceProviderRepository = serviceProviderRepository;
  }

  async create(
    data: CreateServiceProviderDTO
  ): Promise<ServiceProvidersResponseDTO> {
    const formattedCpf = this.normalizeAndFormatCpf(data.cpf);

    if (!isValidCpf(formattedCpf)) {
      return Promise.reject({ status: 400, message: 'Invalid CPF' });
    }

    const existingServiceProvider =
      await this.serviceProviderRepository.findOne({
        where: { cpf: formattedCpf },
      });

    if (existingServiceProvider) {
      return Promise.reject({ status: 400, message: 'CPF already exists' });
    }

    const serviceProvider = this.serviceProviderRepository.create(data);

    return this.serviceProviderRepository
      .save(serviceProvider)
      .then(savedServiceProvider => {
        return Promise.resolve(
          plainToInstance(ServiceProvidersResponseDTO, savedServiceProvider)
        );
      })
      .catch(error => {
        return Promise.reject({
          status: 500,
          message: 'Failed to save service provider',
          error,
        });
      });
  }

  private normalizeAndFormatCpf(cpf: string): string {
    const normalizedCpf = cpf.replace(/[\.\-]/g, '');
    return normalizedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}

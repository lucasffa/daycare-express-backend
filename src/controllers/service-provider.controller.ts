import { Request, Response } from "express";
import { validate } from "class-validator";
import { CreateServiceProviderDTO } from "../dtos/create-service-provider.dto";
import { ServiceProviderService } from "../services/service-provider.service";

export class ServiceProviderController {
  private serviceProviderService: ServiceProviderService;

  constructor(serviceProvidersService: ServiceProviderService) {
    this.serviceProviderService = serviceProvidersService;
  }

  async create(req: Request, res: Response) {
    const data = req.body;

    const dto = new CreateServiceProviderDTO();
    Object.assign(dto, data);

    validate(dto)
      .then((errors) => {
        if (errors.length > 0) {
          return Promise.reject({ status: 400, message: errors });
        } else {
          return this.serviceProviderService.create(dto);
        }
      })
      .then((child) => {
        res.status(201).json({
          message: "Service provider created successfully",
          data: child,
        });
      })
      .catch((error) => {
        if (error.status) {
          res.status(error.status).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Server Error", error });
        }
      });
  }

  async providerTermination(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { terminationMessage } = req.body;
    try {
      const provider = await this.serviceProviderService.providerTermination(
        id,
        terminationMessage
      );

      res.status(200).json({
        message: "Provider terminated successfully",
        data: provider,
      });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}

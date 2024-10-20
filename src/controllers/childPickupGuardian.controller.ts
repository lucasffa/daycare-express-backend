import { Request, Response } from "express";
import { ChildPickupGuardianService } from "../services/childPickupGuardian.service";
import { CreateChildPickupGuardianDTO } from "../dtos/create-childPickupGuardian.dto";
import { validate } from "class-validator";

export class ChildPickupGuardianController {
  private childPickupGuardianService: ChildPickupGuardianService;

  constructor(childPickupGuardianService: ChildPickupGuardianService) {
    this.childPickupGuardianService = childPickupGuardianService;
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = req.body;

    const dto = new CreateChildPickupGuardianDTO();
    Object.assign(dto, data);

    try {
      const erros = await validate(dto);
      if (erros.length > 0) {
        res.status(400).json({ message: erros });
        return;
      }

      const childPickupGuardian = await this.childPickupGuardianService.create(
        dto
      );
      res.status(201).json({
        message: "Child pickup guardian created successfully",
        data: childPickupGuardian,
      });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async RemoveAuthorization(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const childPickupGuardian =
        await this.childPickupGuardianService.RemoveAuthorization(id);
      res.status(200).json({
        message: "Removed authorization from child pickup guardian",
        data: childPickupGuardian,
      });
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}

import { Request, Response } from "express";
import { validate } from "class-validator";
import { ChildService } from "../services/child.service";
import { CreateChildDTO } from "../dtos/create-child.dto";

export class ChildController {
  private childService: ChildService;

  constructor(childService: ChildService) {
    this.childService = childService;
  }

  async create(req: Request, res: Response) {
    const data = req.body;

    const dto = new CreateChildDTO();
    Object.assign(dto, data);

    validate(dto)
      .then((errors) => {
        if (errors.length > 0) {
          return Promise.reject({ status: 400, message: errors });
        } else {
          return this.childService.create(dto);
        }
      })
      .then((child) => {
        res
          .status(201)
          .json({ message: "Child created successfully", data: child });
      })
      .catch((error) => {
        if (error.status) {
          res.status(error.status).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Server Error", error });
        }
      });
  }

  async findChildren(req: Request, res: Response) {
    const { name, cpf, birthDate } = req.query;

    try {
      const children = await this.childService.searchChildren(
        name as string,
        cpf as string,
        birthDate as string
      );

      if (children && children.length > 0) {
        res.status(200).json({ data: children });
      } else {
        res.status(404).json({ message: "Child not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
}

import Papa from "papaparse";
import { Request, Response } from "express";
import { validate, ValidationError } from "class-validator";
import { ChildService } from "../services/child.service";
import { CreateChildDTO } from "../dtos/create-child.dto";

type Child = {
  fullName: string,
  birthDate: string,
  cpf: string,
  address: string,
  medicalInfo: string,
  photo: string,
  imageUsePermission: boolean,
};

type ServiceError = {
  status: number,
  message: string,
}

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

  async createFromCSV(req: Request, res: Response) {
    const csvString = req.file?.buffer.toString();

    if (!csvString) {
      res.status(400).json({ message: "Missing CSV file" });
      return;
    }

    const csv = Papa.parse<Child>(csvString, {
      header: true,
      skipEmptyLines: true,
    });

    const children = csv.data.map((child) => Object.assign(new CreateChildDTO(), child));
    const errors = await this.validateDTOs(children);

    if (errors) {
      res.status(400).json({ message: errors });
      return;
    }

    try {
      const promises = children.map((child) => this.childService.create(child));

      await Promise.all(promises);

      res.status(201).json({ data: children });
    } catch (error) {
      if (this._isServiceError(error)) {
        res.status(error.status).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  private validateDTOs(dtos: CreateChildDTO[]): Promise<ValidationError[] | null> {
    return new Promise(async (resolve) => {
      const promises = dtos.map((dto) => {
        return validate(dto)
          .then((errors) => {
            if (errors.length) {
              resolve(errors);
            }
          });
      });

      await Promise.all(promises);

      resolve(null);
    });
  }

  _isServiceError(error: any): error is ServiceError {
    return error && typeof error.status === "number" && typeof error.message === "string";
  }
}

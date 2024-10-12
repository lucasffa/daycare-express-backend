// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { validate } from 'class-validator';

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async create(req: Request, res: Response) {
        const data = req.body;

        const dto = new CreateUserDTO();
        Object.assign(dto, data);

        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            const user = await this.userService.create(dto);
            res.status(201).json({ message: 'User created successfully', data: user });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const users = await this.userService.findAll();
            res.status(200).json({ data: users });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async findOne(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await this.userService.findOne(id);
            if (user) {
                res.status(200).json({ data: user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body;

        const dto = new UpdateUserDTO();
        Object.assign(dto, data);

        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            const user = await this.userService.update(id, dto);
            if (user) {
                res.status(200).json({ message: 'User updated successfully', data: user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async softDelete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await this.userService.softDelete(id);
            res.status(200).json({ message: 'User soft-deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async toggleActivate(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await this.userService.toggleActivate(id);
            if (user) {
                res.status(200).json({ message: 'User activation toggled', data: user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
}
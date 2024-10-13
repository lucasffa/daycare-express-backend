// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dtos/login.dto';
import { validate } from 'class-validator';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response) {
        const data = req.body;

        const dto = new LoginDTO();
        Object.assign(dto, data);

        validate(dto)
            .then((errors) => {
                if (errors.length > 0) {
                    return Promise.reject({ status: 400, message: errors });
                } else {
                    return this.authService.login(dto);
                }
            })
            .then((response) => {
                res.status(200).json({ message: 'Login successful', response });
            })
            .catch((error) => {
                if (error.status) {
                    res.status(error.status).json({ message: error.message });
                } else {
                    res.status(500).json({ message: 'Internal Server Error', error });
                }
            });
    }
}
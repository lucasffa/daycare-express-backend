// src/configs/environment.config.ts
import { config } from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

config({ path: path.resolve(__dirname, `../../${envFile}`) });

export class Config {
    static getDatabaseType(): string {
        const value = process.env.DB_TYPE;
        if (!value) {
            throw new Error('DB_TYPE not defined.');
        }
        return value;
    }

    static getDatabaseHost(): string {
        const value = process.env.DB_HOST;
        if (!value) {
            throw new Error('DB_HOST not defined.');
        }
        return value;
    }

    static getDatabasePort(): number {
        const value = process.env.DB_PORT;
        if (!value) {
            throw new Error('DB_PORT not defined.');
        }
        return Number(value);
    }

    static getDatabaseUsername(): string {
        const value = process.env.DB_USERNAME;
        if (!value) {
            throw new Error('DB_USERNAME not defined.');
        }
        return value;
    }

    static getDatabasePassword(): string {
        const value = process.env.DB_PASSWORD;
        if (!value) {
            throw new Error('DB_PASSWORD not defined.');
        }
        return value;
    }

    static getDatabaseName(): string {
        const value = process.env.DB_NAME;
        if (!value) {
            throw new Error('DB_NAME not defined.');
        }
        return value;
    }

    static getJwtSecret(): string {
        const value = process.env.JWT_SECRET;
        if (!value) {
            throw new Error('JWT_SECRET not defined.');
        }
        return value;
    }

    static getApiUrl(): string {
        const value = process.env.API_URL;
        if (!value) {
            throw new Error('API_URL not defined.');
        }
        return value;
    }

    static isDevelopment(): boolean {
        return process.env.NODE_ENV !== 'production';
    }
}
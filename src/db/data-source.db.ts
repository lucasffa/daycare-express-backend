// src/db/data-source.ts
import { DataSource } from 'typeorm';
import { Parent } from '../entities/parent.entity';
import { Child } from '../entities/child.entity';
import { ParentChild } from '../entities/parent-child.entity';
import { Config } from '../configs/environment.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.getDatabaseHost(),
  port: Config.getDatabasePort(),
  username: Config.getDatabaseUsername(),
  password: Config.getDatabasePassword(),
  database: Config.getDatabaseName(),
  entities: [Parent, Child, ParentChild],
  synchronize: true,
});

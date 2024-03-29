import { DataSource } from 'typeorm'
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrations: ['./migrations/*.ts'],
  entities: ['./src/repositories/entities/*.ts'],
})

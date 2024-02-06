import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedDb1707235848054 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO lines (name) VALUES ('Green')`)
    await queryRunner.query(`INSERT INTO lines (name) VALUES ('Red')`)
    await queryRunner.query(
      `INSERT INTO line_fares (peak_fare, fare, daily_cap, weekly_cap, origin_line, destination_line) VALUES (2, 1, 8, 55, 'Green', 'Green')`
    )
    await queryRunner.query(
      `INSERT INTO line_fares (peak_fare, fare, daily_cap, weekly_cap, origin_line, destination_line) VALUES (3, 2, 12, 70, 'Red', 'Red')`
    )
    await queryRunner.query(
      `INSERT INTO line_fares (peak_fare, fare, daily_cap, weekly_cap, origin_line, destination_line) VALUES (4, 3, 15, 90, 'Green', 'Red')`
    )
    await queryRunner.query(
      `INSERT INTO line_fares (peak_fare, fare, daily_cap, weekly_cap, origin_line, destination_line) VALUES (3, 2, 15, 90, 'Red', 'Green')`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``)
  }
}

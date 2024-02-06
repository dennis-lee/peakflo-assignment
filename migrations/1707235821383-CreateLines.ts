import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLines1707235821383 implements MigrationInterface {
  name = 'CreateLines1707235821383'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lines" ("name" character varying NOT NULL, CONSTRAINT "PK_e00c638fdac01816ea68e225bb5" PRIMARY KEY ("name"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lines"`)
  }
}

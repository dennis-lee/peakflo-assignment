import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLineFares1707235833913 implements MigrationInterface {
  name = 'CreateLineFares1707235833913'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "line_fares" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "peak_fare" integer NOT NULL, "fare" integer NOT NULL, "daily_cap" integer NOT NULL, "weekly_cap" integer NOT NULL, "origin_line" character varying, "destination_line" character varying, CONSTRAINT "PK_fce6e2038715195568c3da5ae5f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "line_fares" ADD CONSTRAINT "FK_f78a33d7a4e174df4cb8690714d" FOREIGN KEY ("origin_line") REFERENCES "lines"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "line_fares" ADD CONSTRAINT "FK_ead94880190d592d8028e811489" FOREIGN KEY ("destination_line") REFERENCES "lines"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_fares" DROP CONSTRAINT "FK_ead94880190d592d8028e811489"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_fares" DROP CONSTRAINT "FK_f78a33d7a4e174df4cb8690714d"`
    )
    await queryRunner.query(`DROP TABLE "line_fares"`)
  }
}

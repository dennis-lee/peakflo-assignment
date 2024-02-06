import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterLineFares1707252545165 implements MigrationInterface {
    name = 'AlterLineFares1707252545165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_fares" DROP CONSTRAINT "FK_f78a33d7a4e174df4cb8690714d"`);
        await queryRunner.query(`ALTER TABLE "line_fares" DROP CONSTRAINT "FK_ead94880190d592d8028e811489"`);
        await queryRunner.query(`ALTER TABLE "line_fares" DROP CONSTRAINT "PK_fce6e2038715195568c3da5ae5f"`);
        await queryRunner.query(`ALTER TABLE "line_fares" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD CONSTRAINT "PK_2fe00ef5d59db94467dea4a72bd" PRIMARY KEY ("origin_line", "destination_line")`);
        await queryRunner.query(`ALTER TABLE "line_fares" ALTER COLUMN "origin_line" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_fares" ALTER COLUMN "destination_line" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD CONSTRAINT "FK_c07c95e062184f75d37ec116d4f" FOREIGN KEY ("origin_line") REFERENCES "lines"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD CONSTRAINT "FK_6c0e8cc13915c246242f6edb427" FOREIGN KEY ("destination_line") REFERENCES "lines"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_fares" DROP CONSTRAINT "FK_6c0e8cc13915c246242f6edb427"`);
        await queryRunner.query(`ALTER TABLE "line_fares" DROP CONSTRAINT "FK_c07c95e062184f75d37ec116d4f"`);
        await queryRunner.query(`ALTER TABLE "line_fares" ALTER COLUMN "destination_line" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_fares" ALTER COLUMN "origin_line" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_fares" DROP CONSTRAINT "PK_2fe00ef5d59db94467dea4a72bd"`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD CONSTRAINT "PK_fce6e2038715195568c3da5ae5f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD CONSTRAINT "FK_ead94880190d592d8028e811489" FOREIGN KEY ("destination_line") REFERENCES "lines"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line_fares" ADD CONSTRAINT "FK_f78a33d7a4e174df4cb8690714d" FOREIGN KEY ("origin_line") REFERENCES "lines"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

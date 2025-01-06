import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppTypeFeeTypesTable1736156900437 implements MigrationInterface {
    name = 'CreateAppTypeFeeTypesTable1736156900437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_type_fee_types" ("app_type_id" character varying NOT NULL, "fee_type_id" integer NOT NULL, CONSTRAINT "PK_5be69c59901bb837747976608c3" PRIMARY KEY ("app_type_id", "fee_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7429470889d733eb84072df476" ON "app_type_fee_types" ("app_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_95416acaecc26d86ad7f66d8b3" ON "app_type_fee_types" ("fee_type_id") `);
        await queryRunner.query(`ALTER TABLE "app_type_fee_types" ADD CONSTRAINT "FK_7429470889d733eb84072df476f" FOREIGN KEY ("app_type_id") REFERENCES "app_types"("value") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_type_fee_types" ADD CONSTRAINT "FK_95416acaecc26d86ad7f66d8b3e" FOREIGN KEY ("fee_type_id") REFERENCES "fee_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_type_fee_types" DROP CONSTRAINT "FK_95416acaecc26d86ad7f66d8b3e"`);
        await queryRunner.query(`ALTER TABLE "app_type_fee_types" DROP CONSTRAINT "FK_7429470889d733eb84072df476f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95416acaecc26d86ad7f66d8b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7429470889d733eb84072df476"`);
        await queryRunner.query(`DROP TABLE "app_type_fee_types"`);
    }

}

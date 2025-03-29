import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantOperationDependenciesTable1743136852502 implements MigrationInterface {
    name = 'CreateMerchantOperationDependenciesTable1743136852502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant_operation_dependencies" ("operation_code" character varying NOT NULL, "dependent_operation_code" character varying NOT NULL, CONSTRAINT "PK_f6f56daf882f0d6b7ced6857abb" PRIMARY KEY ("operation_code", "dependent_operation_code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1fded93ca4c8e5b11633a8ba6e" ON "merchant_operation_dependencies" ("operation_code") `);
        await queryRunner.query(`CREATE INDEX "IDX_420b5074a34f310e55a6040e52" ON "merchant_operation_dependencies" ("dependent_operation_code") `);
        await queryRunner.query(`ALTER TABLE "merchant_operation_dependencies" ADD CONSTRAINT "FK_1fded93ca4c8e5b11633a8ba6eb" FOREIGN KEY ("operation_code") REFERENCES "merchant_operations"("code") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "merchant_operation_dependencies" ADD CONSTRAINT "FK_420b5074a34f310e55a6040e520" FOREIGN KEY ("dependent_operation_code") REFERENCES "merchant_operations"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_operation_dependencies" DROP CONSTRAINT "FK_420b5074a34f310e55a6040e520"`);
        await queryRunner.query(`ALTER TABLE "merchant_operation_dependencies" DROP CONSTRAINT "FK_1fded93ca4c8e5b11633a8ba6eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_420b5074a34f310e55a6040e52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fded93ca4c8e5b11633a8ba6e"`);
        await queryRunner.query(`DROP TABLE "merchant_operation_dependencies"`);
    }

}

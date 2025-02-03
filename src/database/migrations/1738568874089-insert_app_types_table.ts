import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertAppTypesTable1738568874089 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "app_types" (value,"label") VALUES ('app_driver','Goo+Tài xế')`);
        await queryRunner.query(`INSERT INTO "app_types" (value,"label") VALUES ('app_merchant','Goo+Đối Tác')`);
        await queryRunner.query(`INSERT INTO "app_types" (value,"label") VALUES ('app_client','Goo+')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "app_types" WHERE value = 'app_driver'`);
        await queryRunner.query(`DELETE FROM "app_types" WHERE value = 'app_merchant'`);
        await queryRunner.query(`DELETE FROM "app_types" WHERE value = 'app_client'`);
    }

}

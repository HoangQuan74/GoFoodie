import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTables1732613628852 implements MigrationInterface {
    name = 'AlterStoresTables1732613628852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_a3bf2205e60a2d5a2d2b22c0ad8" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_a3bf2205e60a2d5a2d2b22c0ad8"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "created_by_id"`);
    }

}

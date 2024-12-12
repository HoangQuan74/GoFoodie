import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRolesTable1733991916387 implements MigrationInterface {
    name = 'AlterRolesTable1733991916387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."roles_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "status" "public"."roles_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."roles_status_enum"`);
    }

}

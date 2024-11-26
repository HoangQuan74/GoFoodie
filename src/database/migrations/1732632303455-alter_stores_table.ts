import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTable1732632303455 implements MigrationInterface {
    name = 'AlterStoresTable1732632303455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_avatar_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_cover_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_front_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_menu_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_draft" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_draft"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_menu_id"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_front_id"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_cover_id"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_avatar_id"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "created_at"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrdersTable1737704498502 implements MigrationInterface {
    name = 'AlterOrdersTable1737704498502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_name" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_address_note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_address_note"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_name"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_phone"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1738827528121 implements MigrationInterface {
    name = 'AlterOrderTable1738827528121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "cart_id" integer NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cart_id"`);
    }

}

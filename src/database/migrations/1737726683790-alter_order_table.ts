import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterOrderTable1737726683790 implements MigrationInterface {
    name = 'AlterOrderTable1737726683790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_fee" TYPE numeric(10,0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_fee" TYPE numeric(10,2)`);
    }

}

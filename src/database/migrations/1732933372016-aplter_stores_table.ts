import { MigrationInterface, QueryRunner } from "typeorm";

export class AplterStoresTable1732933372016 implements MigrationInterface {
    name = 'AplterStoresTable1732933372016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "UQ_cdc812fdd2bccdd4cde6e7ce15e" UNIQUE ("store_id")`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "UQ_cdc812fdd2bccdd4cde6e7ce15e"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

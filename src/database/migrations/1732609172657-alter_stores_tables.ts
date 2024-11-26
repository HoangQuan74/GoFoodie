import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoresTables1732609172657 implements MigrationInterface {
    name = 'AlterStoresTables1732609172657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "approved_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "approved_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_d7a69407c67c17a29403d6a739a" FOREIGN KEY ("approved_by_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_d7a69407c67c17a29403d6a739a"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "approved_at"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "approved_by_id"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductCategoryTable1733134664510 implements MigrationInterface {
    name = 'AlterProductCategoryTable1733134664510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_working_time" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer NOT NULL, "day_of_week" integer NOT NULL, "open_time" integer NOT NULL, "close_time" integer NOT NULL, CONSTRAINT "PK_2bfc80ec162d0b5a4097b28b983" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "is_global"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "is_normal_time" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_working_time" ADD CONSTRAINT "FK_c5cdd9fc3a454f9a4fdcf9f968f" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_working_time" DROP CONSTRAINT "FK_c5cdd9fc3a454f9a4fdcf9f968f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_normal_time"`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "is_global" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "product_working_time"`);
    }

}

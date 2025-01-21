import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverAvilablitiesTable1737444655737 implements MigrationInterface {
    name = 'CreateDriverAvilablitiesTable1737444655737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_2ac771f5608abba079a6539fe41"`);
        await queryRunner.query(`ALTER TABLE "challenges" RENAME COLUMN "image_id" TO "imageId"`);
        await queryRunner.query(`CREATE TABLE "driver_availabilities" ("id" SERIAL NOT NULL, "driver_id" integer NOT NULL, "isAvailable" boolean NOT NULL DEFAULT false, "latitude" double precision, "longitude" double precision, "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0393528088a3c1d4e9e3d3ff98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "options"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "productName"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "product_image" character varying`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "product_name" character varying`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "cartProductOptions" json`);
        await queryRunner.query(`ALTER TABLE "driver_availabilities" ADD CONSTRAINT "FK_ea432df306bfb49377ac5766db7" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_948a98f7973e8a99f41bee19028" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_948a98f7973e8a99f41bee19028"`);
        await queryRunner.query(`ALTER TABLE "driver_availabilities" DROP CONSTRAINT "FK_ea432df306bfb49377ac5766db7"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "cartProductOptions"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "product_name"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "product_image"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "productName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "options" json`);
        await queryRunner.query(`DROP TABLE "driver_availabilities"`);
        await queryRunner.query(`ALTER TABLE "challenges" RENAME COLUMN "imageId" TO "image_id"`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_2ac771f5608abba079a6539fe41" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

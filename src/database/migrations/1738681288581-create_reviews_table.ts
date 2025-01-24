import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviewsTable1738681288581 implements MigrationInterface {
    name = 'CreateReviewsTable1738681288581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_review_stores" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "store_id" integer NOT NULL, "order_id" integer NOT NULL, "rating" integer NOT NULL, "comment" character varying, "is_anonymous" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3a7fb9e97c0c18aa465a2dee03f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_review_drivers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, "driver_id" integer NOT NULL, "order_id" integer NOT NULL, "rating" integer NOT NULL, "comment" character varying, CONSTRAINT "PK_03f37f94ca454dac83ae85baa20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_review_store_templates" ("client_review_store_id" integer NOT NULL, "review_template_id" integer NOT NULL, CONSTRAINT "PK_b5d58c72e232799ba82347ddcd4" PRIMARY KEY ("client_review_store_id", "review_template_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a5b35bfaf59d21229382e40e91" ON "client_review_store_templates" ("client_review_store_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_20d56842610ebe0894aaf13350" ON "client_review_store_templates" ("review_template_id") `);
        await queryRunner.query(`CREATE TABLE "client_review_store_files" ("client_review_store_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_f88adacdf602432b416f08f9cd1" PRIMARY KEY ("client_review_store_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a29ce2a03fac3e5d140d517b5b" ON "client_review_store_files" ("client_review_store_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_404e8470ae543bae2af0df1b74" ON "client_review_store_files" ("file_id") `);
        await queryRunner.query(`CREATE TABLE "client_review_driver_templates" ("client_review_driver_id" integer NOT NULL, "review_template_id" integer NOT NULL, CONSTRAINT "PK_4709bbd9fe8f5b622d1b5e81794" PRIMARY KEY ("client_review_driver_id", "review_template_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3c05bf3eae88ba20eb040901cd" ON "client_review_driver_templates" ("client_review_driver_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_10762f5430c2922a86a8ef60e4" ON "client_review_driver_templates" ("review_template_id") `);
        await queryRunner.query(`ALTER TABLE "client_review_stores" ADD CONSTRAINT "FK_0c9163f6afaeb1eb64eeb7025a2" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" ADD CONSTRAINT "FK_21954d725824cc747a5f4331a77" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" ADD CONSTRAINT "FK_e62eda8330a2fa3dc9bde71ee17" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" ADD CONSTRAINT "FK_925714e4c7f5ca6b526b57837d2" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" ADD CONSTRAINT "FK_fd3167b29302109d6ab71e7eeef" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" ADD CONSTRAINT "FK_55cafe651f1cb2e63efa6738ca3" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_review_store_templates" ADD CONSTRAINT "FK_a5b35bfaf59d21229382e40e911" FOREIGN KEY ("client_review_store_id") REFERENCES "client_review_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "client_review_store_templates" ADD CONSTRAINT "FK_20d56842610ebe0894aaf133508" FOREIGN KEY ("review_template_id") REFERENCES "review_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "client_review_store_files" ADD CONSTRAINT "FK_a29ce2a03fac3e5d140d517b5b5" FOREIGN KEY ("client_review_store_id") REFERENCES "client_review_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "client_review_store_files" ADD CONSTRAINT "FK_404e8470ae543bae2af0df1b74d" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "client_review_driver_templates" ADD CONSTRAINT "FK_3c05bf3eae88ba20eb040901cda" FOREIGN KEY ("client_review_driver_id") REFERENCES "client_review_drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "client_review_driver_templates" ADD CONSTRAINT "FK_10762f5430c2922a86a8ef60e45" FOREIGN KEY ("review_template_id") REFERENCES "review_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_review_driver_templates" DROP CONSTRAINT "FK_10762f5430c2922a86a8ef60e45"`);
        await queryRunner.query(`ALTER TABLE "client_review_driver_templates" DROP CONSTRAINT "FK_3c05bf3eae88ba20eb040901cda"`);
        await queryRunner.query(`ALTER TABLE "client_review_store_files" DROP CONSTRAINT "FK_404e8470ae543bae2af0df1b74d"`);
        await queryRunner.query(`ALTER TABLE "client_review_store_files" DROP CONSTRAINT "FK_a29ce2a03fac3e5d140d517b5b5"`);
        await queryRunner.query(`ALTER TABLE "client_review_store_templates" DROP CONSTRAINT "FK_20d56842610ebe0894aaf133508"`);
        await queryRunner.query(`ALTER TABLE "client_review_store_templates" DROP CONSTRAINT "FK_a5b35bfaf59d21229382e40e911"`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" DROP CONSTRAINT "FK_55cafe651f1cb2e63efa6738ca3"`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" DROP CONSTRAINT "FK_fd3167b29302109d6ab71e7eeef"`);
        await queryRunner.query(`ALTER TABLE "client_review_drivers" DROP CONSTRAINT "FK_925714e4c7f5ca6b526b57837d2"`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" DROP CONSTRAINT "FK_e62eda8330a2fa3dc9bde71ee17"`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" DROP CONSTRAINT "FK_21954d725824cc747a5f4331a77"`);
        await queryRunner.query(`ALTER TABLE "client_review_stores" DROP CONSTRAINT "FK_0c9163f6afaeb1eb64eeb7025a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10762f5430c2922a86a8ef60e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c05bf3eae88ba20eb040901cd"`);
        await queryRunner.query(`DROP TABLE "client_review_driver_templates"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_404e8470ae543bae2af0df1b74"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a29ce2a03fac3e5d140d517b5b"`);
        await queryRunner.query(`DROP TABLE "client_review_store_files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20d56842610ebe0894aaf13350"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5b35bfaf59d21229382e40e91"`);
        await queryRunner.query(`DROP TABLE "client_review_store_templates"`);
        await queryRunner.query(`DROP TABLE "client_review_drivers"`);
        await queryRunner.query(`DROP TABLE "client_review_stores"`);
    }

}

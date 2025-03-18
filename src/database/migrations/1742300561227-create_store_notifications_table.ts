import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreNotificationsTable1742300561227 implements MigrationInterface {
    name = 'CreateStoreNotificationsTable1742300561227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_notifications_type_enum" AS ENUM('order', 'promotion', 'news')`);
        await queryRunner.query(`CREATE TABLE "store_notifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, "title" character varying NOT NULL, "content" character varying NOT NULL, "store_id" integer NOT NULL, "type" "public"."store_notifications_type_enum" NOT NULL, "related_id" integer, "read_at" TIMESTAMP, CONSTRAINT "PK_bc81c33fdcdbcac7c577e022ab7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_notifications" ADD CONSTRAINT "FK_5304642f448ae1835839e52eb66" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_notifications" ADD CONSTRAINT "FK_4d3d60165b1df4b6887da969566" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_notifications" DROP CONSTRAINT "FK_4d3d60165b1df4b6887da969566"`);
        await queryRunner.query(`ALTER TABLE "store_notifications" DROP CONSTRAINT "FK_5304642f448ae1835839e52eb66"`);
        await queryRunner.query(`DROP TABLE "store_notifications"`);
        await queryRunner.query(`DROP TYPE "public"."store_notifications_type_enum"`);
    }

}

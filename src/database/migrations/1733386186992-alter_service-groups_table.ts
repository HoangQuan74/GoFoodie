import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterServiceGroupsTable1733386186992 implements MigrationInterface {
    name = 'AlterServiceGroupsTable1733386186992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_493508037ca1735de6a2bbb8414"`);
        await queryRunner.query(`ALTER TABLE "service_groups" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "service_groups" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "service_groups" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "service_groups" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service_groups" ADD "description" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."service_groups_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "service_groups" ADD "status" "public"."service_groups_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "service_group_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_f06f1bc6879b769f9b5eabea079" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_493508037ca1735de6a2bbb8414" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_493508037ca1735de6a2bbb8414"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_f06f1bc6879b769f9b5eabea079"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "service_group_id"`);
        await queryRunner.query(`ALTER TABLE "service_groups" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."service_groups_status_enum"`);
        await queryRunner.query(`ALTER TABLE "service_groups" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "service_groups" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "service_groups" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "service_groups" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "service_groups" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_493508037ca1735de6a2bbb8414" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

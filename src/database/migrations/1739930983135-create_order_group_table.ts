import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderGroupTable1739930983135 implements MigrationInterface {
    name = 'CreateOrderGroupTable1739930983135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_groups_status_enum" AS ENUM('in_delivery', 'delivered')`);
        await queryRunner.query(`CREATE TABLE "order_groups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "status" "public"."order_groups_status_enum" NOT NULL DEFAULT 'in_delivery', CONSTRAINT "PK_6ea7fe44386fee9a655142632a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_group_items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_group_id" integer NOT NULL, "order_id" integer NOT NULL, CONSTRAINT "PK_5905ecd6fe0eac0f8c26553f234" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_groups" ADD CONSTRAINT "FK_2bc8ca26287048e84998a9c786a" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_group_items" ADD CONSTRAINT "FK_a8e379c5bc6ef9054fb448cee17" FOREIGN KEY ("order_group_id") REFERENCES "order_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_group_items" ADD CONSTRAINT "FK_cdf505938899061a5092c24c674" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_group_items" DROP CONSTRAINT "FK_cdf505938899061a5092c24c674"`);
        await queryRunner.query(`ALTER TABLE "order_group_items" DROP CONSTRAINT "FK_a8e379c5bc6ef9054fb448cee17"`);
        await queryRunner.query(`ALTER TABLE "order_groups" DROP CONSTRAINT "FK_2bc8ca26287048e84998a9c786a"`);
        await queryRunner.query(`DROP TABLE "order_group_items"`);
        await queryRunner.query(`DROP TABLE "order_groups"`);
        await queryRunner.query(`DROP TYPE "public"."order_groups_status_enum"`);
    }

}

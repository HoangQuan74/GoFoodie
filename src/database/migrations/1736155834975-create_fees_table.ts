import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFeesTable1736155834975 implements MigrationInterface {
    name = 'CreateFeesTable1736155834975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fee_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_13c213789b6c9fc376303db1fb9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_fees" ("app_type_id" character varying NOT NULL, "fee_id" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_fbbdb627b89e85669c89ab698fa" PRIMARY KEY ("app_type_id", "fee_id"))`);
        await queryRunner.query(`CREATE TABLE "fees" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fee_type_id" integer NOT NULL, "service_type_id" integer NOT NULL, "isActive" boolean NOT NULL, "created_by_id" integer NOT NULL, CONSTRAINT "PK_97f3a1b1b8ee5674fd4da93f461" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "app_fees" ADD CONSTRAINT "FK_508da6a35223661afa925718390" FOREIGN KEY ("app_type_id") REFERENCES "app_types"("value") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_fees" ADD CONSTRAINT "FK_98ea9c7632e1557248c21227c17" FOREIGN KEY ("fee_id") REFERENCES "fees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fees" ADD CONSTRAINT "FK_aeeeb8bef9f7b87b820d72616b9" FOREIGN KEY ("fee_type_id") REFERENCES "fee_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fees" ADD CONSTRAINT "FK_5ca380934f71cbc28c6fcd55cc8" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" DROP CONSTRAINT "FK_5ca380934f71cbc28c6fcd55cc8"`);
        await queryRunner.query(`ALTER TABLE "fees" DROP CONSTRAINT "FK_aeeeb8bef9f7b87b820d72616b9"`);
        await queryRunner.query(`ALTER TABLE "app_fees" DROP CONSTRAINT "FK_98ea9c7632e1557248c21227c17"`);
        await queryRunner.query(`ALTER TABLE "app_fees" DROP CONSTRAINT "FK_508da6a35223661afa925718390"`);
        await queryRunner.query(`DROP TABLE "fees"`);
        await queryRunner.query(`DROP TABLE "app_fees"`);
        await queryRunner.query(`DROP TABLE "fee_types"`);
    }

}

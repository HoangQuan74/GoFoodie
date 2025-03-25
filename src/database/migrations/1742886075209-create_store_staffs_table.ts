import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreStaffsTable1742886075209 implements MigrationInterface {
    name = 'CreateStoreStaffsTable1742886075209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_staffs_status_enum" AS ENUM('active', 'inactive', 'pending')`);
        await queryRunner.query(`CREATE TABLE "store_staffs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" integer NOT NULL, "merchant_id" integer NOT NULL, "role_code" character varying NOT NULL, "status" "public"."store_staffs_status_enum" NOT NULL DEFAULT 'pending', "joined_at" TIMESTAMP, "expired_at" TIMESTAMP, CONSTRAINT "UQ_1613da3bb46ac0ae21708a06b9b" UNIQUE ("store_id", "merchant_id"), CONSTRAINT "PK_4ac7b2245dce7e8f0f0adb6431d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_staff_permissions" ("merchant_id" integer NOT NULL, "operation_code" character varying NOT NULL, CONSTRAINT "PK_8468040074c1a229aad979a63e0" PRIMARY KEY ("merchant_id", "operation_code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9b7b9b19ce29ddc53d18b51667" ON "store_staff_permissions" ("merchant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_76e10572bc8ffbfd868a30aa7d" ON "store_staff_permissions" ("operation_code") `);
        await queryRunner.query(`ALTER TABLE "store_staffs" ADD CONSTRAINT "FK_1c2578f9dc483d4556bc64699fd" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_staffs" ADD CONSTRAINT "FK_952dd33e0e9063de967c3f5c7ec" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_staffs" ADD CONSTRAINT "FK_b370db4d53d689cc24621e1c9b3" FOREIGN KEY ("role_code") REFERENCES "merchant_roles"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_staff_permissions" ADD CONSTRAINT "FK_9b7b9b19ce29ddc53d18b51667a" FOREIGN KEY ("merchant_id") REFERENCES "store_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "store_staff_permissions" ADD CONSTRAINT "FK_76e10572bc8ffbfd868a30aa7d1" FOREIGN KEY ("operation_code") REFERENCES "merchant_operations"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_staff_permissions" DROP CONSTRAINT "FK_76e10572bc8ffbfd868a30aa7d1"`);
        await queryRunner.query(`ALTER TABLE "store_staff_permissions" DROP CONSTRAINT "FK_9b7b9b19ce29ddc53d18b51667a"`);
        await queryRunner.query(`ALTER TABLE "store_staffs" DROP CONSTRAINT "FK_b370db4d53d689cc24621e1c9b3"`);
        await queryRunner.query(`ALTER TABLE "store_staffs" DROP CONSTRAINT "FK_952dd33e0e9063de967c3f5c7ec"`);
        await queryRunner.query(`ALTER TABLE "store_staffs" DROP CONSTRAINT "FK_1c2578f9dc483d4556bc64699fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76e10572bc8ffbfd868a30aa7d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b7b9b19ce29ddc53d18b51667"`);
        await queryRunner.query(`DROP TABLE "store_staff_permissions"`);
        await queryRunner.query(`DROP TABLE "store_staffs"`);
        await queryRunner.query(`DROP TYPE "public"."store_staffs_status_enum"`);
    }

}

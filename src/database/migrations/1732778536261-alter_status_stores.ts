import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStatusStores1732778536261 implements MigrationInterface {
    name = 'AlterStatusStores1732778536261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","merchant_view","public"]);
        await queryRunner.query(`DROP VIEW "merchant_view"`);
        await queryRunner.query(`ALTER TABLE "stores" RENAME COLUMN "is_draft" TO "reject_reason"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "identity_card_date"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "identity_card_date" date`);
        await queryRunner.query(`ALTER TYPE "public"."stores_approval_status_enum" RENAME TO "stores_approval_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."stores_approval_status_enum" AS ENUM('draft', 'pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "approval_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "approval_status" TYPE "public"."stores_approval_status_enum" USING "approval_status"::"text"::"public"."stores_approval_status_enum"`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "approval_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."stores_approval_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "reject_reason"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "reject_reason" character varying`);
        await queryRunner.query(`CREATE VIEW "merchant_view" AS 
    SELECT 
      m.id,
      m.name,
      m.email,
      m.phone,
      m.status,
      m.created_at,
      m.updated_at,
      sum(case when s.approval_status IN ('pending', 'approved') then 1 else 0 end) AS store_number,
      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,
      sum(case when s.approval_status = 'pending' then 1 else 0 end) AS unapproved_store_number
    FROM merchants m
    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL
    WHERE m.deleted_at IS NULL
    GROUP BY m.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","merchant_view","SELECT \n      m.id,\n      m.name,\n      m.email,\n      m.phone,\n      m.status,\n      m.created_at,\n      m.updated_at,\n      sum(case when s.approval_status IN ('pending', 'approved') then 1 else 0 end) AS store_number,\n      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,\n      sum(case when s.approval_status = 'pending' then 1 else 0 end) AS unapproved_store_number\n    FROM merchants m\n    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL\n    WHERE m.deleted_at IS NULL\n    GROUP BY m.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","merchant_view","public"]);
        await queryRunner.query(`DROP VIEW "merchant_view"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "reject_reason"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "reject_reason" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."stores_approval_status_enum_old" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "approval_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "approval_status" TYPE "public"."stores_approval_status_enum_old" USING "approval_status"::"text"::"public"."stores_approval_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "approval_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."stores_approval_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."stores_approval_status_enum_old" RENAME TO "stores_approval_status_enum"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "identity_card_date"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "identity_card_date" character varying`);
        await queryRunner.query(`ALTER TABLE "stores" RENAME COLUMN "reject_reason" TO "is_draft"`);
        await queryRunner.query(`CREATE VIEW "merchant_view" AS SELECT 
      m.id,
      m.name,
      m.email,
      m.phone,
      m.status,
      m.created_at,
      m.updated_at,
      count(s.id) AS store_number,
      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,
      sum(case when s.approval_status = 'rejected' then 1 else 0 end) AS unapproved_store_number
    FROM merchants m
    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL
    WHERE m.deleted_at IS NULL
    GROUP BY m.id`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","merchant_view","SELECT \n      m.id,\n      m.name,\n      m.email,\n      m.phone,\n      m.status,\n      m.created_at,\n      m.updated_at,\n      count(s.id) AS store_number,\n      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,\n      sum(case when s.approval_status = 'rejected' then 1 else 0 end) AS unapproved_store_number\n    FROM merchants m\n    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL\n    WHERE m.deleted_at IS NULL\n    GROUP BY m.id"]);
    }

}

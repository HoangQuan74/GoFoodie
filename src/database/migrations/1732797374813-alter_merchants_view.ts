import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMerchantsView1732797374813 implements MigrationInterface {
    name = 'AlterMerchantsView1732797374813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","merchant_view","public"]);
        await queryRunner.query(`DROP VIEW "merchant_view"`);
        await queryRunner.query(`CREATE VIEW "merchant_view" AS 
    SELECT 
      m.id,
      m.name,
      m.email,
      m.phone,
      m.status,
      m.created_at,
      m.updated_at,
      m.store_id,
      sum(case when s.approval_status IN ('pending', 'approved') then 1 else 0 end) AS store_number,
      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,
      sum(case when s.approval_status = 'pending' then 1 else 0 end) AS unapproved_store_number
    FROM merchants m
    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL
    WHERE m.deleted_at IS NULL
    GROUP BY m.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","merchant_view","SELECT \n      m.id,\n      m.name,\n      m.email,\n      m.phone,\n      m.status,\n      m.created_at,\n      m.updated_at,\n      m.store_id,\n      sum(case when s.approval_status IN ('pending', 'approved') then 1 else 0 end) AS store_number,\n      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,\n      sum(case when s.approval_status = 'pending' then 1 else 0 end) AS unapproved_store_number\n    FROM merchants m\n    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL\n    WHERE m.deleted_at IS NULL\n    GROUP BY m.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","merchant_view","public"]);
        await queryRunner.query(`DROP VIEW "merchant_view"`);
        await queryRunner.query(`CREATE VIEW "merchant_view" AS SELECT 
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
    GROUP BY m.id`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","merchant_view","SELECT \n      m.id,\n      m.name,\n      m.email,\n      m.phone,\n      m.status,\n      m.created_at,\n      m.updated_at,\n      sum(case when s.approval_status IN ('pending', 'approved') then 1 else 0 end) AS store_number,\n      sum(case when s.approval_status = 'approved' then 1 else 0 end) AS approved_store_number,\n      sum(case when s.approval_status = 'pending' then 1 else 0 end) AS unapproved_store_number\n    FROM merchants m\n    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL\n    WHERE m.deleted_at IS NULL\n    GROUP BY m.id"]);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMerchantsView1732257623837 implements MigrationInterface {
  name = 'CreateMerchantsView1732257623837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."stores_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
    await queryRunner.query(
      `CREATE TABLE "stores" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "status" "public"."stores_status_enum" NOT NULL DEFAULT 'approved', CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE VIEW "merchant_view" AS 
    SELECT 
      m.id,
      m.name,
      m.email,
      m.phone,
      m.status,
      m.created_at,
      m.updated_at
      count(s.id) AS store_number,
      sum(case when s.status = 'approved' then 1 else 0 end) AS approved_store_number,
      sum(case when s.status = 'rejected' then 1 else 0 end) AS unapproved_store_number
    FROM merchants m
    LEFT JOIN stores s ON s.merchantId = m.id AND s.deletedAt IS NULL
    WHERE m.deletedAt IS NULL
    GROUP BY m.id
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'merchant_view',
        "SELECT \n      m.id,\n      m.name,\n      m.email,\n      m.phone,\n      m.status,\n      m.created_at,\n      m.updated_at\n      count(s.id) AS store_number,\n      sum(case when s.status = 'approved' then 1 else 0 end) AS approved_store_number,\n      sum(case when s.status = 'rejected' then 1 else 0 end) AS unapproved_store_number\n    FROM merchants m\n    LEFT JOIN stores s ON s.merchantId = m.id AND s.deletedAt IS NULL\n    WHERE m.deletedAt IS NULL\n    GROUP BY m.id",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, [
      'VIEW',
      'merchant_view',
      'public',
    ]);
    await queryRunner.query(`DROP VIEW "merchant_view"`);
    await queryRunner.query(`DROP TABLE "stores"`);
    await queryRunner.query(`DROP TYPE "public"."stores_status_enum"`);
  }
}

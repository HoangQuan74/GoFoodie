import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriversView1739851161218 implements MigrationInterface {
    name = 'CreateDriversView1739851161218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "driver_view" AS 
    SELECT 
      d.id,
      d.full_name,
      d.avatar,
      COALESCE(ROUND(AVG(crd.rating), 1), 0) AS avg_rating
    FROM drivers d
    LEFT JOIN client_review_drivers crd ON d.id = crd.driver_id
    WHERE d.deleted_at IS NULL
    GROUP BY d.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","driver_view","SELECT \n      d.id,\n      d.full_name,\n      d.avatar,\n      COALESCE(ROUND(AVG(crd.rating), 1), 0) AS avg_rating\n    FROM drivers d\n    LEFT JOIN client_review_drivers crd ON d.id = crd.driver_id\n    WHERE d.deleted_at IS NULL\n    GROUP BY d.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","driver_view","public"]);
        await queryRunner.query(`DROP VIEW "driver_view"`);
    }

}

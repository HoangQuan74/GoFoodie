import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreAvailableView1739521841922 implements MigrationInterface {
    name = 'CreateStoreAvailableView1739521841922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "store_available_view" AS 
    SELECT 
      s.id,
      s.store_code,
      s.name,
      s.special_dish,
      s.street_name,
      s.store_avatar_id,
      s.store_cover_id,
      s.status,
      s.approval_status,
      s.created_at,
      s.updated_at,
      sa.lat AS receive_lat,
      sa.lng AS receive_lng,
      COUNT(DISTINCT sl.client_id) AS like_count,
      COUNT(DISTINCT crs.id) AS review_count,
      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating
    FROM stores s
    INNER JOIN store_working_times swt ON (
      s.id = swt.store_id
      AND swt.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
      AND swt.open_time <= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND swt.close_time >= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND swt.is_open = TRUE
    )
    LEFT JOIN store_special_working_time sswt ON (
      s.id = sswt.store_id
      AND sswt.date = CURRENT_DATE
      AND sswt.start_time <= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND sswt.end_time >= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)
      AND sswt.is_open = FALSE
    )
    LEFT JOIN store_likes sl ON s.id = sl.store_id
    LEFT JOIN client_review_stores crs ON s.id = crs.store_id
    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = 'receive'
    WHERE s.deleted_at IS NULL
      AND s.status = 'active'
      AND s.approval_status = 'approved'
      AND s.is_pause = FALSE
      AND sswt.id IS NULL
    GROUP BY s.id, sa.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","store_available_view","SELECT \n      s.id,\n      s.store_code,\n      s.name,\n      s.special_dish,\n      s.street_name,\n      s.store_avatar_id,\n      s.store_cover_id,\n      s.status,\n      s.approval_status,\n      s.created_at,\n      s.updated_at,\n      sa.lat AS receive_lat,\n      sa.lng AS receive_lng,\n      COUNT(DISTINCT sl.client_id) AS like_count,\n      COUNT(DISTINCT crs.id) AS review_count,\n      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating\n    FROM stores s\n    INNER JOIN store_working_times swt ON (\n      s.id = swt.store_id\n      AND swt.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)\n      AND swt.open_time <= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)\n      AND swt.close_time >= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)\n      AND swt.is_open = TRUE\n    )\n    LEFT JOIN store_special_working_time sswt ON (\n      s.id = sswt.store_id\n      AND sswt.date = CURRENT_DATE\n      AND sswt.start_time <= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)\n      AND sswt.end_time >= EXTRACT(HOUR FROM CURRENT_TIME) * 60 + EXTRACT(MINUTE FROM CURRENT_TIME)\n      AND sswt.is_open = FALSE\n    )\n    LEFT JOIN store_likes sl ON s.id = sl.store_id\n    LEFT JOIN client_review_stores crs ON s.id = crs.store_id\n    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = 'receive'\n    WHERE s.deleted_at IS NULL\n      AND s.status = 'active'\n      AND s.approval_status = 'approved'\n      AND s.is_pause = FALSE\n      AND sswt.id IS NULL\n    GROUP BY s.id, sa.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","store_available_view","public"]);
        await queryRunner.query(`DROP VIEW "store_available_view"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterViews1742870343760 implements MigrationInterface {
    name = 'AlterViews1742870343760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","store_view","public"]);
        await queryRunner.query(`DROP VIEW "store_view"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","product_view","public"]);
        await queryRunner.query(`DROP VIEW "product_view"`);
        await queryRunner.query(`CREATE VIEW "store_view" AS 
    SELECT 
      s.id,
      s.store_code,
      s.name,
      LOWER(UNACCENT(CONCAT_WS(' - ', s.name, NULLIF(s.special_dish, ''), NULLIF(s.street_name, '')))) AS name_unaccent,
      s.special_dish,
      s.street_name,
      s.store_avatar_id,
      s.store_cover_id,
      s.status,
      s.approval_status,
      s.is_pause,
      s.created_at,
      s.updated_at,
      sa.lat AS receive_lat,
      sa.lng AS receive_lng,
      COUNT(DISTINCT sl.client_id) AS like_count,
      COUNT(DISTINCT crs.id) AS review_count,
      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating
    FROM stores s
    LEFT JOIN store_likes sl ON s.id = sl.store_id
    LEFT JOIN client_review_stores crs ON s.id = crs.store_id
    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = 'receive'
    WHERE s.deleted_at IS NULL
    GROUP BY s.id, sa.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","store_view","SELECT \n      s.id,\n      s.store_code,\n      s.name,\n      LOWER(UNACCENT(CONCAT_WS(' - ', s.name, NULLIF(s.special_dish, ''), NULLIF(s.street_name, '')))) AS name_unaccent,\n      s.special_dish,\n      s.street_name,\n      s.store_avatar_id,\n      s.store_cover_id,\n      s.status,\n      s.approval_status,\n      s.is_pause,\n      s.created_at,\n      s.updated_at,\n      sa.lat AS receive_lat,\n      sa.lng AS receive_lng,\n      COUNT(DISTINCT sl.client_id) AS like_count,\n      COUNT(DISTINCT crs.id) AS review_count,\n      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating\n    FROM stores s\n    LEFT JOIN store_likes sl ON s.id = sl.store_id\n    LEFT JOIN client_review_stores crs ON s.id = crs.store_id\n    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = 'receive'\n    WHERE s.deleted_at IS NULL\n    GROUP BY s.id, sa.id"]);
        await queryRunner.query(`CREATE VIEW "product_view" AS 
    SELECT 
      p.id,
      p.name,
      LOWER(unaccent(p.name)) AS name_unaccent,
      p.code,
      p.price,
      p.status,
      p.approval_status,
      p.store_id,
      p.product_category_id,
      p.created_at,
      p.updated_at,
      p.image_id,
      p.description,  
      COUNT(DISTINCT pl.client_id) AS liked,
      COUNT(DISTINCT oi.id) AS sold
    FROM products p
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    WHERE p.deleted_at IS NULL
    GROUP BY p.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","product_view","SELECT \n      p.id,\n      p.name,\n      LOWER(unaccent(p.name)) AS name_unaccent,\n      p.code,\n      p.price,\n      p.status,\n      p.approval_status,\n      p.store_id,\n      p.product_category_id,\n      p.created_at,\n      p.updated_at,\n      p.image_id,\n      p.description,  \n      COUNT(DISTINCT pl.client_id) AS liked,\n      COUNT(DISTINCT oi.id) AS sold\n    FROM products p\n    LEFT JOIN product_likes pl ON p.id = pl.product_id\n    LEFT JOIN order_items oi ON p.id = oi.product_id\n    WHERE p.deleted_at IS NULL\n    GROUP BY p.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","product_view","public"]);
        await queryRunner.query(`DROP VIEW "product_view"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","store_view","public"]);
        await queryRunner.query(`DROP VIEW "store_view"`);
        await queryRunner.query(`CREATE VIEW "product_view" AS SELECT 
      p.id,
      p.name,
      p.code,
      p.price,
      p.status,
      p.approval_status,
      p.store_id,
      p.product_category_id,
      p.created_at,
      p.updated_at,
      p.image_id,
      p.description,  
      COUNT(DISTINCT pl.client_id) AS liked,
      COUNT(DISTINCT oi.id) AS sold
    FROM products p
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    WHERE p.deleted_at IS NULL
    GROUP BY p.id`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","product_view","SELECT \n      p.id,\n      p.name,\n      p.code,\n      p.price,\n      p.status,\n      p.approval_status,\n      p.store_id,\n      p.product_category_id,\n      p.created_at,\n      p.updated_at,\n      p.image_id,\n      p.description,  \n      COUNT(DISTINCT pl.client_id) AS liked,\n      COUNT(DISTINCT oi.id) AS sold\n    FROM products p\n    LEFT JOIN product_likes pl ON p.id = pl.product_id\n    LEFT JOIN order_items oi ON p.id = oi.product_id\n    WHERE p.deleted_at IS NULL\n    GROUP BY p.id"]);
        await queryRunner.query(`CREATE VIEW "store_view" AS SELECT 
      s.id,
      s.store_code,
      s.name,
      s.special_dish,
      s.street_name,
      s.store_avatar_id,
      s.store_cover_id,
      s.status,
      s.approval_status,
      s.is_pause,
      s.created_at,
      s.updated_at,
      sa.lat AS receive_lat,
      sa.lng AS receive_lng,
      COUNT(DISTINCT sl.client_id) AS like_count,
      COUNT(DISTINCT crs.id) AS review_count,
      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating
    FROM stores s
    LEFT JOIN store_likes sl ON s.id = sl.store_id
    LEFT JOIN client_review_stores crs ON s.id = crs.store_id
    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = 'receive'
    WHERE s.deleted_at IS NULL
    GROUP BY s.id, sa.id`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","store_view","SELECT \n      s.id,\n      s.store_code,\n      s.name,\n      s.special_dish,\n      s.street_name,\n      s.store_avatar_id,\n      s.store_cover_id,\n      s.status,\n      s.approval_status,\n      s.is_pause,\n      s.created_at,\n      s.updated_at,\n      sa.lat AS receive_lat,\n      sa.lng AS receive_lng,\n      COUNT(DISTINCT sl.client_id) AS like_count,\n      COUNT(DISTINCT crs.id) AS review_count,\n      COALESCE(ROUND(AVG(crs.rating), 1), 0) AS avg_rating\n    FROM stores s\n    LEFT JOIN store_likes sl ON s.id = sl.store_id\n    LEFT JOIN client_review_stores crs ON s.id = crs.store_id\n    LEFT JOIN store_address sa ON s.id = sa.store_id AND sa.type = 'receive'\n    WHERE s.deleted_at IS NULL\n    GROUP BY s.id, sa.id"]);
    }

}

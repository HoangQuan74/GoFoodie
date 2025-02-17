import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsView1739781593234 implements MigrationInterface {
    name = 'CreateProductsView1739781593234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "product_view" AS 
    SELECT 
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
    GROUP BY p.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","product_view","SELECT \n      p.id,\n      p.name,\n      p.code,\n      p.price,\n      p.status,\n      p.approval_status,\n      p.store_id,\n      p.product_category_id,\n      p.created_at,\n      p.updated_at,\n      p.image_id,\n      p.description,  \n      COUNT(DISTINCT pl.client_id) AS liked,\n      COUNT(DISTINCT oi.id) AS sold\n    FROM products p\n    LEFT JOIN product_likes pl ON p.id = pl.product_id\n    LEFT JOIN order_items oi ON p.id = oi.product_id\n    WHERE p.deleted_at IS NULL\n    GROUP BY p.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","product_view","public"]);
        await queryRunner.query(`DROP VIEW "product_view"`);
    }

}

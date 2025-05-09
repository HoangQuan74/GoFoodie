import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantRequestFilesTable1738762536134 implements MigrationInterface {
    name = 'CreateMerchantRequestFilesTable1738762536134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant_request_files" ("merchant_request_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_45669d2179b4dc95a4d4ba4d225" PRIMARY KEY ("merchant_request_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af28863b74cc0d9896788b2d78" ON "merchant_request_files" ("merchant_request_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4a8d9f5b852174d29216f778e" ON "merchant_request_files" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "merchant_request_files" ADD CONSTRAINT "FK_af28863b74cc0d9896788b2d78e" FOREIGN KEY ("merchant_request_id") REFERENCES "merchant_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "merchant_request_files" ADD CONSTRAINT "FK_b4a8d9f5b852174d29216f778e5" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_request_files" DROP CONSTRAINT "FK_b4a8d9f5b852174d29216f778e5"`);
        await queryRunner.query(`ALTER TABLE "merchant_request_files" DROP CONSTRAINT "FK_af28863b74cc0d9896788b2d78e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4a8d9f5b852174d29216f778e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af28863b74cc0d9896788b2d78"`);
        await queryRunner.query(`DROP TABLE "merchant_request_files"`);
    }

}

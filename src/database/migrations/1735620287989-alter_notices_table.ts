import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterNoticesTable1735620287989 implements MigrationInterface {
    name = 'AlterNoticesTable1735620287989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notice_criteria" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "notice_id" integer NOT NULL, "type" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_a40c5f7c3262c7af4c1bd20cc88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notices" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "notice_criteria" ADD CONSTRAINT "FK_e0769df7b3a2eede3d850bf0269" FOREIGN KEY ("notice_id") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notices" ADD CONSTRAINT "FK_1e29bece74053c85f39aace0989" FOREIGN KEY ("created_by_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notices" DROP CONSTRAINT "FK_1e29bece74053c85f39aace0989"`);
        await queryRunner.query(`ALTER TABLE "notice_criteria" DROP CONSTRAINT "FK_e0769df7b3a2eede3d850bf0269"`);
        await queryRunner.query(`ALTER TABLE "notices" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`DROP TABLE "notice_criteria"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAdminNotificationsTable1739239932169 implements MigrationInterface {
    name = 'AlterAdminNotificationsTable1739239932169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD "image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" ADD CONSTRAINT "FK_a299d8918d8732cdd098f4aa412" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP CONSTRAINT "FK_a299d8918d8732cdd098f4aa412"`);
        await queryRunner.query(`ALTER TABLE "admin_notifications" DROP COLUMN "image_id"`);
    }

}

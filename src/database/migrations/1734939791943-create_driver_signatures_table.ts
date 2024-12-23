import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverSignaturesTable1734939791943 implements MigrationInterface {
    name = 'CreateDriverSignaturesTable1734939791943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver_signatures" ("driver_id" integer NOT NULL, "signature_image_id" uuid NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "REL_721cea708cd2d1bfd5956ee3c3" UNIQUE ("signature_image_id"), CONSTRAINT "PK_66a83af83c0dcd8cd3ed5644491" PRIMARY KEY ("driver_id"))`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" ADD CONSTRAINT "FK_66a83af83c0dcd8cd3ed5644491" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" ADD CONSTRAINT "FK_721cea708cd2d1bfd5956ee3c3b" FOREIGN KEY ("signature_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_signatures" DROP CONSTRAINT "FK_721cea708cd2d1bfd5956ee3c3b"`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" DROP CONSTRAINT "FK_66a83af83c0dcd8cd3ed5644491"`);
        await queryRunner.query(`DROP TABLE "driver_signatures"`);
    }

}

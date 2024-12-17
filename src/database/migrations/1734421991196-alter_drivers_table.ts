import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDriversTable1734421991196 implements MigrationInterface {
    name = 'AlterDriversTable1734421991196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver_refresh_tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "driver_id" integer NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "device_token" character varying NOT NULL, "is_revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8638c3360bbc4bdcf2dd309d52f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "device_token" character varying`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "last_login" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" ADD CONSTRAINT "FK_ca7cbda51fa4b5d3a0872db61d6" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" DROP CONSTRAINT "FK_ca7cbda51fa4b5d3a0872db61d6"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "last_login"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "device_token"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "password"`);
        await queryRunner.query(`DROP TABLE "driver_refresh_tokens"`);
    }

}

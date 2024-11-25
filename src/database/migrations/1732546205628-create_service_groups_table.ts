import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceGroupsTable1732546205628 implements MigrationInterface {
    name = 'CreateServiceGroupsTable1732546205628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c541600efebc3f4fefd3d082ef3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service_groups"`);
    }

}

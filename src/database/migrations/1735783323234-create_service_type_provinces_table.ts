import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceTypeProvincesTable1735783323234 implements MigrationInterface {
    name = 'CreateServiceTypeProvincesTable1735783323234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mail_histories" ("id" SERIAL NOT NULL, "to" character varying NOT NULL, "subject" character varying NOT NULL, "body" character varying NOT NULL, "is_sent" boolean NOT NULL DEFAULT false, "retry_count" integer NOT NULL DEFAULT '0', "sent_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d506d3f726075f90e87dfe27cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_type_provinces" ("service_type_id" integer NOT NULL, "province_id" integer NOT NULL, CONSTRAINT "PK_4b8ae506499054304ba81bfe3cf" PRIMARY KEY ("service_type_id", "province_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14f6463d8a251cd25aa6b89b5f" ON "service_type_provinces" ("service_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3ae4fafc0beb88ed4bdbb3e52" ON "service_type_provinces" ("province_id") `);
        await queryRunner.query(`ALTER TABLE "service_type_provinces" ADD CONSTRAINT "FK_14f6463d8a251cd25aa6b89b5fe" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "service_type_provinces" ADD CONSTRAINT "FK_e3ae4fafc0beb88ed4bdbb3e521" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_type_provinces" DROP CONSTRAINT "FK_e3ae4fafc0beb88ed4bdbb3e521"`);
        await queryRunner.query(`ALTER TABLE "service_type_provinces" DROP CONSTRAINT "FK_14f6463d8a251cd25aa6b89b5fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3ae4fafc0beb88ed4bdbb3e52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14f6463d8a251cd25aa6b89b5f"`);
        await queryRunner.query(`DROP TABLE "service_type_provinces"`);
        await queryRunner.query(`DROP TABLE "mail_histories"`);
    }

}

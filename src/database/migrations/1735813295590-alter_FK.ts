import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFK1735813295590 implements MigrationInterface {
    name = 'AlterFK1735813295590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_8c59dbd265e6e4bef0305294022"`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" DROP CONSTRAINT "FK_66a83af83c0dcd8cd3ed5644491"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_bba0338c3e3a77ecb7f41d54793"`);
        await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" DROP CONSTRAINT "FK_ca7cbda51fa4b5d3a0872db61d6"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_8c59dbd265e6e4bef0305294022" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" ADD CONSTRAINT "FK_66a83af83c0dcd8cd3ed5644491" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_bba0338c3e3a77ecb7f41d54793" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" ADD CONSTRAINT "FK_ca7cbda51fa4b5d3a0872db61d6" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" DROP CONSTRAINT "FK_ca7cbda51fa4b5d3a0872db61d6"`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" DROP CONSTRAINT "FK_bba0338c3e3a77ecb7f41d54793"`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" DROP CONSTRAINT "FK_66a83af83c0dcd8cd3ed5644491"`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" DROP CONSTRAINT "FK_8c59dbd265e6e4bef0305294022"`);
        await queryRunner.query(`ALTER TABLE "driver_refresh_tokens" ADD CONSTRAINT "FK_ca7cbda51fa4b5d3a0872db61d6" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_uniforms" ADD CONSTRAINT "FK_bba0338c3e3a77ecb7f41d54793" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_signatures" ADD CONSTRAINT "FK_66a83af83c0dcd8cd3ed5644491" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "driver_vehicles" ADD CONSTRAINT "FK_8c59dbd265e6e4bef0305294022" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

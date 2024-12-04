import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductOptionGroupsTable1733298845487 implements MigrationInterface {
    name = 'AlterProductOptionGroupsTable1733298845487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_8d17fb61344ff9acf7b706ae022"`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_8d17fb61344ff9acf7b706ae022" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_8d17fb61344ff9acf7b706ae022"`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_8d17fb61344ff9acf7b706ae022" FOREIGN KEY ("option_id") REFERENCES "option_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

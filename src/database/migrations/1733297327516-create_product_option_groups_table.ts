import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductOptionGroupsTable1733297327516 implements MigrationInterface {
    name = 'CreateProductOptionGroupsTable1733297327516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_option_groups" ("product_id" integer NOT NULL, "option_group_id" integer NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_54758711bd3db159cc2fb7cabf5" PRIMARY KEY ("product_id", "option_group_id"))`);
        await queryRunner.query(`CREATE TABLE "product_options" ("product_option_group_id" integer NOT NULL, "option_id" integer NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_b6617415d56ddb78834d2f857c2" PRIMARY KEY ("product_option_group_id", "option_id"))`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_493508037ca1735de6a2bbb8414" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_6ab2af71e5db94d67f565379686" FOREIGN KEY ("option_group_id") REFERENCES "option_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_600766f3147695bec1e1efe2649" FOREIGN KEY ("product_option_group_id", "product_option_group_id") REFERENCES "product_option_groups"("product_id","option_group_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_8d17fb61344ff9acf7b706ae022" FOREIGN KEY ("option_id") REFERENCES "option_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_8d17fb61344ff9acf7b706ae022"`);
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_600766f3147695bec1e1efe2649"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_6ab2af71e5db94d67f565379686"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_493508037ca1735de6a2bbb8414"`);
        await queryRunner.query(`DROP TABLE "product_options"`);
        await queryRunner.query(`DROP TABLE "product_option_groups"`);
    }

}

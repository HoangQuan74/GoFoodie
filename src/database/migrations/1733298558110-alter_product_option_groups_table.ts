import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductOptionGroupsTable1733298558110 implements MigrationInterface {
    name = 'AlterProductOptionGroupsTable1733298558110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_600766f3147695bec1e1efe2649"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "PK_54758711bd3db159cc2fb7cabf5"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "PK_fa4d1a2f515e3eb72269dad579f" PRIMARY KEY ("product_id", "option_group_id", "id")`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_493508037ca1735de6a2bbb8414"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_6ab2af71e5db94d67f565379686"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "PK_fa4d1a2f515e3eb72269dad579f"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "PK_ec73cbbf3812f0155fce3ed88a2" PRIMARY KEY ("option_group_id", "id")`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "PK_ec73cbbf3812f0155fce3ed88a2"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "PK_2e78264f1a9edb1c2f775d9dd36" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_493508037ca1735de6a2bbb8414" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_6ab2af71e5db94d67f565379686" FOREIGN KEY ("option_group_id") REFERENCES "option_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_837aafc0cb0344e9858f42b3eaa" FOREIGN KEY ("product_option_group_id") REFERENCES "product_option_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_options" DROP CONSTRAINT "FK_837aafc0cb0344e9858f42b3eaa"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_6ab2af71e5db94d67f565379686"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "FK_493508037ca1735de6a2bbb8414"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "PK_2e78264f1a9edb1c2f775d9dd36"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "PK_ec73cbbf3812f0155fce3ed88a2" PRIMARY KEY ("option_group_id", "id")`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "PK_ec73cbbf3812f0155fce3ed88a2"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "PK_fa4d1a2f515e3eb72269dad579f" PRIMARY KEY ("product_id", "option_group_id", "id")`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_6ab2af71e5db94d67f565379686" FOREIGN KEY ("option_group_id") REFERENCES "option_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "FK_493508037ca1735de6a2bbb8414" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP CONSTRAINT "PK_fa4d1a2f515e3eb72269dad579f"`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" ADD CONSTRAINT "PK_54758711bd3db159cc2fb7cabf5" PRIMARY KEY ("product_id", "option_group_id")`);
        await queryRunner.query(`ALTER TABLE "product_option_groups" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_options" ADD CONSTRAINT "FK_600766f3147695bec1e1efe2649" FOREIGN KEY ("product_option_group_id", "product_option_group_id") REFERENCES "product_option_groups"("option_group_id","product_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

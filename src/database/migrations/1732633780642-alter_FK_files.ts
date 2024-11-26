import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFKFiles1732633780642 implements MigrationInterface {
    name = 'AlterFKFiles1732633780642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_ddd7ce07b23125172ecc5bac544"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_avatar_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_avatar_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_cover_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_cover_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_front_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_front_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_menu_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_menu_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b239800ab44bfbd766deb2fd241" FOREIGN KEY ("store_avatar_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_bfa280d0aee85cfbb9c319adbff" FOREIGN KEY ("store_cover_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_b792a8ca92c9abe6e273adc90bc" FOREIGN KEY ("store_front_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8af2c6f71b71ec5ebafe614c4bb" FOREIGN KEY ("store_menu_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00" FOREIGN KEY ("identity_card_front_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0" FOREIGN KEY ("identity_card_back_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_ddd7ce07b23125172ecc5bac544" FOREIGN KEY ("business_license_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0" FOREIGN KEY ("tax_license_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_ddd7ce07b23125172ecc5bac544"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8af2c6f71b71ec5ebafe614c4bb"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b792a8ca92c9abe6e273adc90bc"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_bfa280d0aee85cfbb9c319adbff"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_b239800ab44bfbd766deb2fd241"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_menu_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_menu_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_front_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_front_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_cover_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_cover_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "store_avatar_id"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "store_avatar_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_ddd7ce07b23125172ecc5bac544" FOREIGN KEY ("business_license_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0" FOREIGN KEY ("tax_license_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0" FOREIGN KEY ("identity_card_back_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00" FOREIGN KEY ("identity_card_front_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

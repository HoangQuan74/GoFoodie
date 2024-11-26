import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStoreRepresentativesTables1732604617843 implements MigrationInterface {
    name = 'AlterStoreRepresentativesTables1732604617843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "other_phone"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "PK_cdc812fdd2bccdd4cde6e7ce15e"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "PK_d4590f31d46c4324739729f41ce" PRIMARY KEY ("store_id", "id")`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "order_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "store_banks" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "tax_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "identity_card_date"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "identity_card_date" character varying`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "business_license_image_id"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "business_license_image_id" uuid`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "tax_license_image_id"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "tax_license_image_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "PK_d4590f31d46c4324739729f41ce"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "PK_1f84d4b3ae129efc2f70439fc8a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_branch" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_working_times" DROP COLUMN "open_time"`);
        await queryRunner.query(`ALTER TABLE "store_working_times" ADD "open_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_working_times" DROP COLUMN "close_time"`);
        await queryRunner.query(`ALTER TABLE "store_working_times" ADD "close_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00" FOREIGN KEY ("identity_card_front_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0" FOREIGN KEY ("identity_card_back_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_ddd7ce07b23125172ecc5bac544" FOREIGN KEY ("business_license_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0" FOREIGN KEY ("tax_license_image_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_069ced22c602187f1f4a0c4d6c0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_ddd7ce07b23125172ecc5bac544"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e"`);
        await queryRunner.query(`ALTER TABLE "store_working_times" DROP COLUMN "close_time"`);
        await queryRunner.query(`ALTER TABLE "store_working_times" ADD "close_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_working_times" DROP COLUMN "open_time"`);
        await queryRunner.query(`ALTER TABLE "store_working_times" ADD "open_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_account_number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_branch" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_banks" ALTER COLUMN "bank_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "PK_1f84d4b3ae129efc2f70439fc8a"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "PK_d4590f31d46c4324739729f41ce" PRIMARY KEY ("store_id", "id")`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "tax_license_image_id"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "tax_license_image_id" character varying`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "business_license_image_id"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "business_license_image_id" character varying`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "identity_card_date"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "identity_card_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "tax_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_cdc812fdd2bccdd4cde6e7ce15e" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "store_banks" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "order_phone"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP CONSTRAINT "PK_d4590f31d46c4324739729f41ce"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "PK_cdc812fdd2bccdd4cde6e7ce15e" PRIMARY KEY ("store_id")`);
        await queryRunner.query(`ALTER TABLE "store_representatives" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD "other_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_d592ad550f70cc7c26b9b9c1fa0" FOREIGN KEY ("identity_card_back_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_representatives" ADD CONSTRAINT "FK_bbb4e65beb59aa609d07afa5c00" FOREIGN KEY ("identity_card_front_image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

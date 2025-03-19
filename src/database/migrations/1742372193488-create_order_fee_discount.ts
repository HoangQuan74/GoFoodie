import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderFeeDiscount1742372193488 implements MigrationInterface {
    name = 'CreateOrderFeeDiscount1742372193488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_fees_discounts" ("order_id" integer NOT NULL, "driver_tip" bigint NOT NULL DEFAULT '0', "driver_delivery_fee" bigint NOT NULL DEFAULT '0', "driver_parking_fee" bigint NOT NULL DEFAULT '0', "driver_peak_hour_fee" bigint NOT NULL DEFAULT '0', "order_discount_amount" bigint NOT NULL DEFAULT '0', "is_store_order_voucher" boolean NOT NULL DEFAULT false, "delivery_fee_discount_amount" bigint NOT NULL DEFAULT '0', "is_store_delivery_voucher" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e87d8ed4aeda93e95876e815bf1" PRIMARY KEY ("order_id")); COMMENT ON COLUMN "order_fees_discounts"."driver_tip" IS 'Tiền tip tài xế thực nhận'; COMMENT ON COLUMN "order_fees_discounts"."driver_delivery_fee" IS 'Tiền phí giao hàng tài xế thực nhận'; COMMENT ON COLUMN "order_fees_discounts"."driver_parking_fee" IS 'Tiền phí gữi xe tài xế thực nhận'; COMMENT ON COLUMN "order_fees_discounts"."driver_peak_hour_fee" IS 'Tiền phí giờ cao điểm tài xế thực nhận'; COMMENT ON COLUMN "order_fees_discounts"."order_discount_amount" IS 'Số tiền giảm giá đơn hàng của client'; COMMENT ON COLUMN "order_fees_discounts"."delivery_fee_discount_amount" IS 'Số tiền giảm giá phí giao hàng của client'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "driver_income" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_fees_discounts" ADD CONSTRAINT "FK_e87d8ed4aeda93e95876e815bf1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_fees_discounts" DROP CONSTRAINT "FK_e87d8ed4aeda93e95876e815bf1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "driver_income"`);
        await queryRunner.query(`DROP TABLE "order_fees_discounts"`);
    }

}

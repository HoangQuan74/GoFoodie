import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertReviewCriteriaTable1738724211725 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.review_criteria ("name") VALUES ('Sạch sẽ')`);
        await queryRunner.query(`INSERT INTO public.review_criteria ("name") VALUES ('Thái độ tốt')`);
        await queryRunner.query(`INSERT INTO public.review_criteria ("name") VALUES ('Văn minh, lịch sự')`);
        await queryRunner.query(`INSERT INTO public.review_criteria ("name") VALUES ('Cận thận, chu đáo')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM public.review_criteria`);     
    }

}

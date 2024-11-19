import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1728532667451 implements MigrationInterface {
  name = 'Init1728532667451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`t_users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, \`deleted_by\` int NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_activated\` tinyint NOT NULL DEFAULT 1, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`last_login\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`t_users\``);
  }
}

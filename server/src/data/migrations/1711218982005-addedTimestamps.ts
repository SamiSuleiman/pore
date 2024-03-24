import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTimestamps1711218982005 implements MigrationInterface {
    name = 'AddedTimestamps1711218982005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`source\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`tag\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`link\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`word\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`link\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`source\` DROP COLUMN \`createdAt\``);
    }

}

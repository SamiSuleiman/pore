import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1710099551968 implements MigrationInterface {
    name = 'Init1710099551968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`example\` (\`id\` uuid NOT NULL, \`content\` varchar(210) NOT NULL, \`wordId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`source\` (\`id\` uuid NOT NULL, \`type\` varchar(60) NOT NULL, \`content\` varchar(180) NOT NULL, \`userId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` uuid NOT NULL, \`title\` varchar(60) NOT NULL, \`desc\` varchar(180) NOT NULL, \`color\` varchar(15) NOT NULL, \`userId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` uuid NOT NULL, \`name\` varchar(60) NOT NULL, \`email\` varchar(60) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`link\` (\`id\` uuid NOT NULL, \`title\` varchar(60) NOT NULL, \`desc\` varchar(300) NOT NULL, \`userId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word\` (\`id\` uuid NOT NULL, \`content\` varchar(60) NOT NULL, \`language\` varchar(60) NOT NULL, \`userId\` uuid NOT NULL, \`sourceId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`definition\` (\`id\` uuid NOT NULL, \`content\` varchar(210) NOT NULL, \`wordId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word_tags_tag\` (\`wordId\` uuid NOT NULL, \`tagId\` uuid NOT NULL, INDEX \`IDX_0866554b5c4d53026477821ce3\` (\`wordId\`), INDEX \`IDX_546f9d79c5f1c472380db3cfdf\` (\`tagId\`), PRIMARY KEY (\`wordId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word_links_link\` (\`wordId\` uuid NOT NULL, \`linkId\` uuid NOT NULL, INDEX \`IDX_036a86de3d78e15a8a3639e8be\` (\`wordId\`), INDEX \`IDX_2f5f9b0d61c4c22d86c81a75a9\` (\`linkId\`), PRIMARY KEY (\`wordId\`, \`linkId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`example\` ADD CONSTRAINT \`FK_866f1894863affe4e2c781fb2de\` FOREIGN KEY (\`wordId\`) REFERENCES \`word\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`source\` ADD CONSTRAINT \`FK_ee6c36f54891cc9dc488a778a2b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tag\` ADD CONSTRAINT \`FK_d0dc39ff83e384b4a097f47d3f5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link\` ADD CONSTRAINT \`FK_14a562b14bb83fc8ba73d30d3e0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`word\` ADD CONSTRAINT \`FK_4d9fb2abff81f0e34ae02be3178\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`word\` ADD CONSTRAINT \`FK_0be286decdd726ad5f5c033886b\` FOREIGN KEY (\`sourceId\`) REFERENCES \`source\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`definition\` ADD CONSTRAINT \`FK_6ecaf5335a70d7f37d7338ca36f\` FOREIGN KEY (\`wordId\`) REFERENCES \`word\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`word_tags_tag\` ADD CONSTRAINT \`FK_0866554b5c4d53026477821ce3c\` FOREIGN KEY (\`wordId\`) REFERENCES \`word\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`word_tags_tag\` ADD CONSTRAINT \`FK_546f9d79c5f1c472380db3cfdf1\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`word_links_link\` ADD CONSTRAINT \`FK_036a86de3d78e15a8a3639e8be3\` FOREIGN KEY (\`wordId\`) REFERENCES \`word\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`word_links_link\` ADD CONSTRAINT \`FK_2f5f9b0d61c4c22d86c81a75a9d\` FOREIGN KEY (\`linkId\`) REFERENCES \`link\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_links_link\` DROP FOREIGN KEY \`FK_2f5f9b0d61c4c22d86c81a75a9d\``);
        await queryRunner.query(`ALTER TABLE \`word_links_link\` DROP FOREIGN KEY \`FK_036a86de3d78e15a8a3639e8be3\``);
        await queryRunner.query(`ALTER TABLE \`word_tags_tag\` DROP FOREIGN KEY \`FK_546f9d79c5f1c472380db3cfdf1\``);
        await queryRunner.query(`ALTER TABLE \`word_tags_tag\` DROP FOREIGN KEY \`FK_0866554b5c4d53026477821ce3c\``);
        await queryRunner.query(`ALTER TABLE \`definition\` DROP FOREIGN KEY \`FK_6ecaf5335a70d7f37d7338ca36f\``);
        await queryRunner.query(`ALTER TABLE \`word\` DROP FOREIGN KEY \`FK_0be286decdd726ad5f5c033886b\``);
        await queryRunner.query(`ALTER TABLE \`word\` DROP FOREIGN KEY \`FK_4d9fb2abff81f0e34ae02be3178\``);
        await queryRunner.query(`ALTER TABLE \`link\` DROP FOREIGN KEY \`FK_14a562b14bb83fc8ba73d30d3e0\``);
        await queryRunner.query(`ALTER TABLE \`tag\` DROP FOREIGN KEY \`FK_d0dc39ff83e384b4a097f47d3f5\``);
        await queryRunner.query(`ALTER TABLE \`source\` DROP FOREIGN KEY \`FK_ee6c36f54891cc9dc488a778a2b\``);
        await queryRunner.query(`ALTER TABLE \`example\` DROP FOREIGN KEY \`FK_866f1894863affe4e2c781fb2de\``);
        await queryRunner.query(`DROP INDEX \`IDX_2f5f9b0d61c4c22d86c81a75a9\` ON \`word_links_link\``);
        await queryRunner.query(`DROP INDEX \`IDX_036a86de3d78e15a8a3639e8be\` ON \`word_links_link\``);
        await queryRunner.query(`DROP TABLE \`word_links_link\``);
        await queryRunner.query(`DROP INDEX \`IDX_546f9d79c5f1c472380db3cfdf\` ON \`word_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_0866554b5c4d53026477821ce3\` ON \`word_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`word_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`definition\``);
        await queryRunner.query(`DROP TABLE \`word\``);
        await queryRunner.query(`DROP TABLE \`link\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP TABLE \`source\``);
        await queryRunner.query(`DROP TABLE \`example\``);
    }

}

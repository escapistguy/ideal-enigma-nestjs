import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovePasswordFromArticles1637533741720 implements MigrationInterface {
    name = 'RemovePasswordFromArticles1637533741720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "password" character varying NOT NULL`);
    }

}

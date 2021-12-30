import {MigrationInterface, QueryRunner} from "typeorm";

export class AddManyUsersToManyArticlesRelation1640566432105 implements MigrationInterface {
    name = 'AddManyUsersToManyArticlesRelation1640566432105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_favorite_articles_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_5e6a38ffa40953309bd041e9dbd" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37d51cebb5c10cea017b69a67e" ON "users_favorite_articles_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_38e3397851a6b640d545eb9541" ON "users_favorite_articles_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "users_favorite_articles_articles" ADD CONSTRAINT "FK_37d51cebb5c10cea017b69a67ec" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_favorite_articles_articles" ADD CONSTRAINT "FK_38e3397851a6b640d545eb95417" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_favorite_articles_articles" DROP CONSTRAINT "FK_38e3397851a6b640d545eb95417"`);
        await queryRunner.query(`ALTER TABLE "users_favorite_articles_articles" DROP CONSTRAINT "FK_37d51cebb5c10cea017b69a67ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38e3397851a6b640d545eb9541"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37d51cebb5c10cea017b69a67e"`);
        await queryRunner.query(`DROP TABLE "users_favorite_articles_articles"`);
    }

}

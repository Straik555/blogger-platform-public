import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentsTables1792433327529 implements MigrationInterface {
  name = 'CommentsTables1792433327529';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "post_id" uuid NOT NULL,
        "content" character varying(1500) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE`,
    );

    await queryRunner.query(`
      CREATE TABLE "comment_likes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "comment_id" uuid NOT NULL,
        "status" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "comment_id_user_id_unique" UNIQUE ("comment_id", "user_id"),
        CONSTRAINT "status" CHECK ("status" IN ('Like', 'Dislike', 'None'))
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "comment_likes" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_id" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment_likes"`);
    await queryRunner.query(`DROP TABLE "comments"`);
  }
}

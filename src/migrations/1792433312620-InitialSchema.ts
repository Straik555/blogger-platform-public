import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1792433312620 implements MigrationInterface {
  name = 'InitialSchema1792433312620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "login" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "email" CHECK (length(email::text) >= 5), CONSTRAINT "login" CHECK (length(login::text) >= 1), CONSTRAINT "users_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_users_email_active" ON "users" ("email") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_users_login_active" ON "users" ("login") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "recovery_passwords" ("user_id" uuid NOT NULL, "recovery_code" character varying, "is_confirmed" boolean NOT NULL DEFAULT false, "expiration_date" TIMESTAMP WITH TIME ZONE, CONSTRAINT "recovery_passwords_pkey" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "recovery_passwords_code_key" ON "recovery_passwords" ("recovery_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "email_confirmations" ("user_id" uuid NOT NULL, "confirmation_code" character varying, "is_confirmed" boolean NOT NULL DEFAULT false, "expiration_date" TIMESTAMP WITH TIME ZONE, CONSTRAINT "email_confirmations_pkey" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "email_confirmations_code_key" ON "email_confirmations" ("confirmation_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("device_id" uuid NOT NULL, "user_id" uuid NOT NULL, "ip" character varying(255) NOT NULL, "device_name" character varying(255) NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "version" integer NOT NULL, CONSTRAINT "session_pkey" PRIMARY KEY ("device_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(255) NOT NULL, "description" character varying(1000) NOT NULL, "website_url" character varying(255) NOT NULL, "is_membership" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, CONSTRAINT "website_url" CHECK (length(website_url::text) >= 9), CONSTRAINT "name" CHECK (length(name::text) >= 1), CONSTRAINT "blogs_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying(255) NOT NULL, "short_description" character varying(500) NOT NULL, "content" character varying(2000) NOT NULL, "blog_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, CONSTRAINT "posts_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_likes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "post_id" uuid NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "post_id_user_id_unique" UNIQUE ("post_id", "user_id"), CONSTRAINT "status" CHECK ("status" IN ('Like', 'Dislike', 'None')), CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery_passwords" ADD CONSTRAINT "recovery_passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmations" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "blog_id" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_likes" DROP CONSTRAINT "post_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" DROP CONSTRAINT "user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "blog_id"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "session_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmations" DROP CONSTRAINT "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery_passwords" DROP CONSTRAINT "recovery_passwords_user_id_fkey"`,
    );
    await queryRunner.query(`DROP TABLE "post_likes"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(
      `DROP INDEX "public"."email_confirmations_code_key"`,
    );
    await queryRunner.query(`DROP TABLE "email_confirmations"`);
    await queryRunner.query(
      `DROP INDEX "public"."recovery_passwords_code_key"`,
    );
    await queryRunner.query(`DROP TABLE "recovery_passwords"`);
    await queryRunner.query(`DROP INDEX "public"."idx_users_login_active"`);
    await queryRunner.query(`DROP INDEX "public"."idx_users_email_active"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

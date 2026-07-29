import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlsTable1785344680728 implements MigrationInterface {
    name = 'CreateUrlsTable1785344680728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."urls_status_enum" AS ENUM('pending', 'in_progress', 'success', 'error', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "urls" ("id" SERIAL NOT NULL, "url" character varying(2048) NOT NULL, "status" "public"."urls_status_enum" NOT NULL DEFAULT 'pending', "status_code" smallint, "error_message" text, "started_at" TIMESTAMP WITH TIME ZONE, "finished_at" TIMESTAMP WITH TIME ZONE, "duration" integer, "job_id" integer, CONSTRAINT "PK_eaf7bec915960b26aa4988d73b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "urls" ADD CONSTRAINT "FK_a5ed9db167f143a97da6f1e38f0" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "urls" DROP CONSTRAINT "FK_a5ed9db167f143a97da6f1e38f0"`);
        await queryRunner.query(`DROP TABLE "urls"`);
        await queryRunner.query(`DROP TYPE "public"."urls_status_enum"`);
    }

}

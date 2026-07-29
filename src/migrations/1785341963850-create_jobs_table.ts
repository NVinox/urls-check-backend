import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobsTable1785341963850 implements MigrationInterface {
    name = 'CreateJobsTable1785341963850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."jobs_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'cancelled', 'failed')`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" SERIAL NOT NULL, "job_id" character varying(35) NOT NULL, "status" "public"."jobs_status_enum" NOT NULL DEFAULT 'pending', "url_count" smallint NOT NULL, "success_count" smallint NOT NULL, "error_count" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TYPE "public"."jobs_status_enum"`);
    }

}

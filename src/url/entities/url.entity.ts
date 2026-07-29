import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { JobEntity } from 'src/job/entities/job.entity';

import { EUrlStatus } from 'src/enums/EUrlStatus.enum';

@Entity({ name: 'urls' })
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 2048 })
  url!: string;

  @Column({ type: 'enum', enum: EUrlStatus, default: EUrlStatus.PENDING })
  status!: EUrlStatus;

  @Column({ name: 'status_code', type: 'smallint', nullable: true })
  statusCode!: number | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @Column({
    name: 'started_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  startedAt!: Date | null;

  @Column({
    name: 'finished_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  finishedAt!: Date | null;

  @Column({
    name: 'duration',
    type: 'integer',
    nullable: true,
  })
  duration!: number | null;

  @ManyToOne(() => JobEntity, (job) => job.urls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: JobEntity;
}

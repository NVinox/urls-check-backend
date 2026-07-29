import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EJobStatus } from 'src/enums/EJobStatus.enum';

@Entity({ name: 'jobs' })
export class JobEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'job_id', type: 'varchar', length: 35 })
  jobId!: string;

  @Column({ type: 'enum', enum: EJobStatus, default: EJobStatus.PENDING })
  status!: EJobStatus;

  @Column({ name: 'url_count', type: 'smallint' })
  urlCount!: number;

  @Column({ name: 'success_count', type: 'smallint' })
  successCount!: number;

  @Column({ name: 'error_count', type: 'smallint' })
  errorCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

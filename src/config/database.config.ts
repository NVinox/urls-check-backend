import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function getDatabaseConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> {
  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DB'),
    autoLoadEntities: true,
    synchronize: false,
  };
}

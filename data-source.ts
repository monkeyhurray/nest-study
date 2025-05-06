import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // .env 파일 로드

// 기본 DB 설정
const dbConfig: any = {
  synchronize: false,
  migrations: ['dist/migrations/*.js'], // 빌드 후 마이그레이션 경로
};

const environment = process.env.NODE_ENV || 'development';

switch (environment) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite', // SQLite 사용
      database: 'db.sqlite',
      entities: ['**/*.entity.ts'], // 개발 및 테스트에서는 TypeScript 경로
      migrations: ['migrations/*.ts'], // 개발 및 테스트에서는 TypeScript 경로
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite', // SQLite 사용
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'], // 개발 및 테스트에서는 TypeScript 경로
      migrations: ['migrations/*.ts'], // 개발 및 테스트에서는 TypeScript 경로
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres', // PostgreSQL 사용 (환경에 맞게 설정)
      url: process.env.DATABASE_URL, // 환경 변수로부터 DB URL 가져오기
      entities: ['**/*.entity.js'], // 프로덕션에서는 빌드된 JavaScript 경로
      migrations: ['dist/migrations/*.js'], // 프로덕션에서도 빌드된 마이그레이션 경로
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('Unknown environment');
}

export default new DataSource(dbConfig);

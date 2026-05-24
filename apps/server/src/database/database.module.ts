import { Global, Module } from '@nestjs/common';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '../common/env';
import * as schema from './schema';

export const DATABASE = 'DATABASE' as const;

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

const databaseProvider = {
  provide: DATABASE,
  useFactory: (): DrizzleDB => {
    const client = createClient({ url: env.DATABASE_URL });
    return drizzle({ client, schema });
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE],
})
export class DatabaseModule {}

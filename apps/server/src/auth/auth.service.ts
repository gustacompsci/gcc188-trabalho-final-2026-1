import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '../common/env';
import { DATABASE, DrizzleDB } from '../database/database.module';
import * as schema from '../database/schema';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly _auth: ReturnType<typeof betterAuth>;

  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {
    this._auth = betterAuth({
      database: drizzleAdapter(this.db, { provider: 'sqlite', schema }),
      trustedOrigins: [env.CORS_ORIGIN],
      emailAndPassword: { enabled: true },
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      advanced: {
        defaultCookieAttributes: {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
        },
      },
      plugins: [],
      databaseHooks: {
        user: {
          create: {
            before: async (user) => {
              if (!user.email.endsWith('.ufla.br')) return false;
            },
          },
        },
      },
    });
  }

  get auth() {
    return this._auth;
  }
}

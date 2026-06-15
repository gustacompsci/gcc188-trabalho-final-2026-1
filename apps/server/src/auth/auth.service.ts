import { Inject, Injectable } from "@nestjs/common";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { env } from "../common/env";
import { DATABASE, type DrizzleDB } from "../database/database.module";
import * as schema from "../database/schema";

@Injectable()
export class AuthService {
  // biome-ignore lint/suspicious/noExplicitAny: inferred from betterAuth
  private readonly _auth: ReturnType<typeof betterAuth<any>>;

  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {
    this._auth = betterAuth({
      database: drizzleAdapter(this.db, { provider: "sqlite", schema }),
      trustedOrigins: [env.CORS_ORIGIN],
      emailAndPassword: { enabled: true },
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      advanced: {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        },
      },
      plugins: [],
      databaseHooks: {
        user: {
          create: {
            before: async (user) => {
              if (!user.email.endsWith("@ufla.br") && !user.email.endsWith("@estudante.ufla.br"))
                return false;
            },
          },
        },
      },
    });
  }

  get auth() {
    return this._auth;
  }

  async updateUserCourse(userId: string, courseId: string) {
    await this.db.update(schema.user).set({ courseId }).where(eq(schema.user.id, userId));
  }
}

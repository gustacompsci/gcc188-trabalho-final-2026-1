import { createDb } from "@extraufla/db";
import * as schema from "@extraufla/db/schema";
import { env } from "@extraufla/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",

      schema: schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
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
            if (!user.email.endsWith(".ufla.br")) {
              return false;
            }
          },
        },
      },
    },
  });
}

export const auth = createAuth();

import { Inject, Injectable } from "@nestjs/common";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "../common/env";
import { DATABASE, type DrizzleDB } from "../database/database.module";
import * as schema from "../database/schema";

@Injectable()
export class AuthService {
  // biome-ignore lint/suspicious/noExplicitAny: inferred from betterAuth
  private readonly _auth: ReturnType<typeof betterAuth<any>>;

  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {
    const resend = new Resend(env.RESEND_API_KEY);

    this._auth = betterAuth({
      database: drizzleAdapter(this.db, { provider: "sqlite", schema }),
      trustedOrigins: [env.CORS_ORIGIN],
      emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
          const safeUrl = new URL(url);
          if (safeUrl.origin !== new URL(env.CORS_ORIGIN).origin) return;
          const esc = (s: string) =>
            s
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");
          await resend.emails.send({
            from: "ExtraUFLA <no-reply@extraufla.com.br>",
            to: user.email,
            subject: "Recuperação de senha — ExtraUFLA",
            html: `<p>Olá, ${esc(user.name)}!</p><p>Clique no link abaixo para redefinir sua senha:</p><p><a href="${esc(safeUrl.toString())}">${esc(safeUrl.toString())}</a></p><p>O link expira em 1 hora.</p>`,
          });
        },
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

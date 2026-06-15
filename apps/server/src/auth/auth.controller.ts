import { type SignInDto, type SignUpDto, signInSchema, signUpSchema } from "@extraufla/shared";
import { Body, Controller, Get, HttpException, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in/email")
  async signInEmail(
    @Body(new ZodValidationPipe(signInSchema)) body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.auth.api.signInEmail({
      body,
      asResponse: true,
    });
    this.forwardSetCookie(response, res);
    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      throw new HttpException(data.message ?? "Credenciais inválidas", response.status);
    }
    return response.json();
  }

  @Post("sign-up/email")
  async signUpEmail(
    @Body(new ZodValidationPipe(signUpSchema)) body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { courseId, confirmPassword: _confirmPassword, ...betterAuthBody } = body;
    const response = await this.authService.auth.api.signUpEmail({
      body: betterAuthBody,
      asResponse: true,
    });
    this.forwardSetCookie(response, res);
    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      throw new HttpException(data.message ?? "Erro ao criar conta", response.status);
    }
    const result = (await response.json()) as { user: { id: string } };
    await this.authService.updateUserCourse(result.user.id, courseId);
    return result;
  }

  @Post("sign-out")
  async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.auth.api.signOut({
      headers: new Headers({ cookie: req.headers.cookie ?? "" }),
      asResponse: true,
    });
    this.forwardSetCookie(response, res);
    return { success: true };
  }

  @Get("get-session")
  async getSession(@Req() req: Request, @Res() res: Response) {
    const session = await this.authService.auth.api.getSession({
      headers: new Headers({ cookie: req.headers.cookie ?? "" }),
    });
    res.status(200).json(session);
  }

  private forwardSetCookie(from: globalThis.Response, to: Response) {
    const cookies = from.headers.getSetCookie?.() ?? [];
    if (cookies.length > 0) to.setHeader("Set-Cookie", cookies);
  }
}

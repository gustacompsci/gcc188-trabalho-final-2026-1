import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const session = await this.authService.auth.api.getSession({
      headers: new Headers({ cookie: req.headers.cookie ?? "" }),
    });
    if (!session) throw new UnauthorizedException();
    // biome-ignore lint/suspicious/noExplicitAny: attaching session to request
    (req as any).session = session;
    return true;
  }
}

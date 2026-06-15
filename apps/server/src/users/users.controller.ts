import { type PatchUserDto, patchUserSchema } from "@extraufla/shared";
import { Body, Controller, Patch, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "../auth/auth.service";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Patch("me")
  async patchMe(
    @Req() req: Request,
    @Body(new ZodValidationPipe(patchUserSchema)) body: PatchUserDto,
  ) {
    const session = await this.authService.auth.api.getSession({
      headers: new Headers({ cookie: req.headers.cookie ?? "" }),
    });

    if (!session) throw new UnauthorizedException();

    return this.usersService.patchMe(session.user.id, body);
  }
}

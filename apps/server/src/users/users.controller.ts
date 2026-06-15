import { type PatchUserDto, patchUserSchema } from "@extraufla/shared";
import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../common/auth.guard";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("me")
  @UseGuards(AuthGuard)
  patchMe(@Req() req: Request, @Body(new ZodValidationPipe(patchUserSchema)) body: PatchUserDto) {
    // biome-ignore lint/suspicious/noExplicitAny: session attached by AuthGuard
    const session = (req as any).session as { user: { id: string } };
    return this.usersService.patchMe(session.user.id, body);
  }
}

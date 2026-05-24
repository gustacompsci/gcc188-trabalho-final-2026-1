import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.authService.auth.handler(req, res);
  }
}

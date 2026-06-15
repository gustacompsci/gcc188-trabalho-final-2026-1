import {
  type CreateOrganizationDto,
  type CreateSelectiveProcessDto,
  createOrganizationSchema,
  createSelectiveProcessSchema,
  type ListOrganizationsQuery,
  listOrganizationsQuerySchema,
} from "@extraufla/shared";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../common/auth.guard";
import { Roles, RolesGuard } from "../common/roles.guard";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { OrganizationsService } from "./organizations.service";

@Controller("api/organizations")
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listOrganizationsQuerySchema))
    query: ListOrganizationsQuery,
  ) {
    return this.organizationsService.listOrganizations(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("leader", "admin")
  create(
    @Body(new ZodValidationPipe(createOrganizationSchema)) body: CreateOrganizationDto,
    @Req() req: Request,
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: session attached by AuthGuard
    const session = (req as any).session as { user: { id: string } };
    return this.organizationsService.createOrganization(body, session.user.id);
  }

  @Post(":id/processes")
  @HttpCode(201)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("leader", "admin")
  createProcess(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(createSelectiveProcessSchema)) body: CreateSelectiveProcessDto,
    @Req() req: Request,
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: session attached by AuthGuard
    const session = (req as any).session as { user: { id: string } };
    return this.organizationsService.createProcess(id, body, session.user.id);
  }
}

import { type ListOrganizationsQuery, listOrganizationsQuerySchema } from "@extraufla/shared";
import { Controller, Get, Param, Query } from "@nestjs/common";
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
}

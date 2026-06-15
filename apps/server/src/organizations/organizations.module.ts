import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../common/auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, AuthGuard, RolesGuard],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}

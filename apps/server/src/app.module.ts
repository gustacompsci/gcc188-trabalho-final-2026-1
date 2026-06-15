import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { DatabaseModule } from "./database/database.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [DatabaseModule, AuthModule, CoursesModule, OrganizationsModule, UsersModule],
})
export class AppModule {}

import type { PatchUserDto } from "@extraufla/shared";
import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { user } from "../auth/auth.sql";
import { DATABASE, type DrizzleDB } from "../database/database.module";

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async patchMe(userId: string, dto: PatchUserDto) {
    const updates: Partial<typeof user.$inferInsert> = {};

    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.courseId !== undefined) updates.courseId = dto.courseId;

    const [updated] = await this.db
      .update(user)
      .set(updates)
      .where(eq(user.id, userId))
      .returning();

    return updated;
  }
}

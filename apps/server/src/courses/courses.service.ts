import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DATABASE, DrizzleDB } from '../database/database.module';
import { course } from '../database/schema';
import coursesData from '../../data/courses.json';

@Injectable()
export class CoursesService implements OnModuleInit {
  constructor(@Inject(DATABASE) private readonly db: DrizzleDB) {}

  async onModuleInit() {
    await this.seedCourses();
  }

  async listCourses() {
    return this.db.select().from(course);
  }

  async seedCourses() {
    for (const c of coursesData) {
      await this.db
        .insert(course)
        .values({ id: c.id, name: c.name })
        .onConflictDoNothing();
    }
  }
}

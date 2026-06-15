import type { Course } from "@extraufla/shared";
import { http } from "./http";

export const coursesQuery = () =>
  ({
    queryKey: ["courses"] as const,
    queryFn: () => http.get<Course[]>("/courses"),
    staleTime: 1000 * 60 * 60,
  }) as const;

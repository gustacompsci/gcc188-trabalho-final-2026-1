import type { SelectiveProcessStatus } from "@extraufla/shared";

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function deriveStatus(startDate: Date, endDate: Date): SelectiveProcessStatus {
  const now = Date.now();
  if (now < startDate.getTime()) return "scheduled";
  if (now > endDate.getTime()) return "closed";
  return "open";
}

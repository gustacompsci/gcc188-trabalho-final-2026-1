import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  organization: ["create", "update", "delete"],
  process: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const studentRole = ac.newRole({});

export const leaderRole = ac.newRole({
  organization: ["update"],
  process: ["create", "update", "delete"],
});

export const adminRole = ac.newRole({
  organization: ["create", "update", "delete"],
  process: ["create", "update", "delete"],
});

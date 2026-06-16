import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

function makeContext(role: string | undefined): ExecutionContext {
  return {
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        session: role !== undefined ? { user: { role } } : undefined,
      }),
    }),
  } as unknown as ExecutionContext;
}

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it("passes when no roles metadata is set (public route)", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    expect(guard.canActivate(makeContext("student"))).toBe(true);
  });

  it("passes when user role is in the allowed list", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["leader", "admin"]);
    expect(guard.canActivate(makeContext("leader"))).toBe(true);
  });

  it("throws ForbiddenException when role is not in the allowed list", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["leader", "admin"]);
    expect(() => guard.canActivate(makeContext("student"))).toThrow(ForbiddenException);
  });

  it("defaults to student when session has no role field", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["leader"]);
    expect(() => guard.canActivate(makeContext(undefined))).toThrow(ForbiddenException);
  });

  it("throws when admin is not explicitly in the required list", () => {
    // Guard is simple inclusion — no role hierarchy
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["leader"]);
    expect(() => guard.canActivate(makeContext("admin"))).toThrow(ForbiddenException);
  });

  it("passes when admin is explicitly listed", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["leader", "admin"]);
    expect(guard.canActivate(makeContext("admin"))).toBe(true);
  });
});

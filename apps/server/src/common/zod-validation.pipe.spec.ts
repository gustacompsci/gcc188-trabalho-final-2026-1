import { BadRequestException } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "./zod-validation.pipe";

const schema = z.object({ name: z.string().min(1, "required") });
const pipe = new ZodValidationPipe(schema);

describe("ZodValidationPipe", () => {
  it("returns the parsed value on valid input", () => {
    expect(pipe.transform({ name: "test" })).toEqual({ name: "test" });
  });

  it("strips unknown fields (Zod strips by default)", () => {
    expect(pipe.transform({ name: "test", extra: true })).toEqual({ name: "test" });
  });

  it("throws BadRequestException on invalid input", () => {
    expect(() => pipe.transform({ name: "" })).toThrow(BadRequestException);
  });

  it("includes flattened field errors in the exception body", () => {
    try {
      pipe.transform({});
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const body = (e as BadRequestException).getResponse() as Record<string, unknown>;
      expect(body).toHaveProperty("fieldErrors");
    }
  });

  it("throws on null input", () => {
    expect(() => pipe.transform(null)).toThrow(BadRequestException);
  });
});

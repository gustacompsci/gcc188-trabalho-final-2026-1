import { deriveStatus, slugify } from "./utils";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Comp Júnior")).toBe("comp-junior");
  });

  it("strips combining marks (accents)", () => {
    expect(slugify("Núcleo de IA")).toBe("nucleo-de-ia");
  });

  it("removes special characters", () => {
    expect(slugify("C&T / Lab#1")).toBe("ct-lab1");
  });

  it("collapses multiple spaces", () => {
    expect(slugify("  Nome   Longo  ")).toBe("nome-longo");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("Robótica--Júnior")).toBe("robotica-junior");
  });

  it("passes through an already-valid slug", () => {
    expect(slugify("comp-junior")).toBe("comp-junior");
  });
});

describe("deriveStatus", () => {
  const ago = (ms: number) => new Date(Date.now() - ms);
  const from = (ms: number) => new Date(Date.now() + ms);
  const DAY = 86_400_000;

  it('returns "scheduled" when start is in the future', () => {
    expect(deriveStatus(from(DAY), from(2 * DAY))).toBe("scheduled");
  });

  it('returns "open" when now is between start and end', () => {
    expect(deriveStatus(ago(DAY), from(DAY))).toBe("open");
  });

  it('returns "closed" when end is in the past', () => {
    expect(deriveStatus(ago(2 * DAY), ago(DAY))).toBe("closed");
  });

  it('returns "open" when end is just ahead (boundary)', () => {
    expect(deriveStatus(ago(DAY), from(1))).toBe("open");
  });
});

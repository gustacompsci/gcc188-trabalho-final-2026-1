import { jest } from "@jest/globals";

const mockSend = jest.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null });

export class Resend {
  emails = { send: mockSend };
}

// Runs before every spec file — sets env vars before any module (including env.ts) is loaded.
// dotenv/config (imported by env.ts) does NOT override already-set process.env values.
// Each Jest worker gets a unique DB file for test isolation.
const suffix = Math.random().toString(36).slice(2, 10);
process.env.DATABASE_URL = `file:/tmp/extraufla-test-${suffix}.db`;
process.env.BETTER_AUTH_SECRET = "test-secret-for-testing-purposes-xxxxx";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:5173";
process.env.RESEND_API_KEY = "re_test_key";
process.env.NODE_ENV = "test";

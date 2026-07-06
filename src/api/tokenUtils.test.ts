import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { decodeToken, isTokenExpired, isTokenValid, getAccessToken } from "./tokenUtils";

// Helper to create a dummy JWT token with a given payload
const createDummyToken = (payload: object): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = "dummy_signature";
  return `${header}.${payloadStr}.${signature}`;
};

describe("tokenUtils", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("decodeToken", () => {
    it("should successfully decode a valid JWT token payload", () => {
      const payload = { userId: "123", name: "Alice" };
      const token = createDummyToken(payload);
      
      const decoded = decodeToken(token);
      expect(decoded).toEqual(payload);
    });

    it("should return null for malformed tokens", () => {
      const decoded = decodeToken("invalid-token-string");
      expect(decoded).toBeNull();
    });

    it("should return null if there is an error during decoding", () => {
      // Missing payload part
      const decoded = decodeToken("header.");
      expect(decoded).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("should return true if token has no exp field", () => {
      const token = createDummyToken({ userId: "123" });
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return true for a malformed token", () => {
      expect(isTokenExpired("bad-token")).toBe(true);
    });

    it("should return false if token expiration time is in the future", () => {
      // Set system time to 1000000000000 ms (approx 2001)
      const nowMs = 1000000000000;
      vi.setSystemTime(new Date(nowMs));
      
      // Expire in 10 seconds (1000000010 seconds, wait, exp is in seconds, so nowMs / 1000 + 10)
      const expSeconds = (nowMs / 1000) + 10;
      const token = createDummyToken({ exp: expSeconds });
      
      expect(isTokenExpired(token)).toBe(false);
    });

    it("should return true if token expiration time is in the past", () => {
      const nowMs = 1000000000000;
      vi.setSystemTime(new Date(nowMs));
      
      // Expired 10 seconds ago
      const expSeconds = (nowMs / 1000) - 10;
      const token = createDummyToken({ exp: expSeconds });
      
      expect(isTokenExpired(token)).toBe(true);
    });
  });

  describe("isTokenValid", () => {
    it("should return false if no token in localStorage", () => {
      expect(isTokenValid()).toBe(false);
    });

    it("should return true if token in localStorage is valid and not expired", () => {
      const nowMs = 1000000000000;
      vi.setSystemTime(new Date(nowMs));
      
      const token = createDummyToken({ exp: (nowMs / 1000) + 60 });
      localStorage.setItem("accessToken", token);
      
      expect(isTokenValid()).toBe(true);
    });

    it("should return false if token in localStorage is expired", () => {
      const nowMs = 1000000000000;
      vi.setSystemTime(new Date(nowMs));
      
      const token = createDummyToken({ exp: (nowMs / 1000) - 60 });
      localStorage.setItem("accessToken", token);
      
      expect(isTokenValid()).toBe(false);
    });
  });

  describe("getAccessToken", () => {
    it("should retrieve token from localStorage", () => {
      localStorage.setItem("accessToken", "my-secret-token");
      expect(getAccessToken()).toBe("my-secret-token");
    });

    it("should return null if no token is stored", () => {
      expect(getAccessToken()).toBeNull();
    });
  });
});

import { ApiResponse } from "@/models/shared/api";
import {
  isRateLimitError,
  isTokenRevocationError,
  getErrorMessage,
  getErrorToastType,
  getErrorTitle,
} from "./errorHandling";

describe("errorHandling utilities", () => {
  describe("isRateLimitError", () => {
    it("should return true for 429 status", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 429,
        message: "Rate limit exceeded",
        data: null,
        fieldErrors: {},
      };
      expect(isRateLimitError(response)).toBe(true);
    });

    it("should return false for other status codes", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "Unauthorized",
        data: null,
        fieldErrors: {},
      };
      expect(isRateLimitError(response)).toBe(false);
    });
  });

  describe("isTokenRevocationError", () => {
    it("should return true for 401 with revoked message", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "User token has been revoked. Please log in again.",
        data: null,
        fieldErrors: {},
      };
      expect(isTokenRevocationError(response)).toBe(true);
    });

    it("should return true for 401 with revoked in message", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "Token revoked",
        data: null,
        fieldErrors: {},
      };
      expect(isTokenRevocationError(response)).toBe(true);
    });

    it("should return false for other 401 errors", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "Unauthorized",
        data: null,
        fieldErrors: {},
      };
      expect(isTokenRevocationError(response)).toBe(false);
    });

    it("should return false for non-401 errors", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 403,
        message: "Forbidden",
        data: null,
        fieldErrors: {},
      };
      expect(isTokenRevocationError(response)).toBe(false);
    });
  });

  describe("getErrorMessage", () => {
    it("should return rate limit message for 429", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 429,
        message: "Rate limit exceeded. Maximum 10 requests per 15 minutes.",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorMessage(response)).toBe(
        "Rate limit exceeded. Maximum 10 requests per 15 minutes."
      );
    });

    it("should return token revocation message for revoked token", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "User token has been revoked. Please log in again.",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorMessage(response)).toBe(
        "User token has been revoked. Please log in again."
      );
    });

    it("should return custom message from response", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 400,
        message: "Custom error message",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorMessage(response)).toBe("Custom error message");
    });
  });

  describe("getErrorToastType", () => {
    it("should return warning for rate limit errors", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 429,
        message: "Rate limit exceeded",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorToastType(response)).toBe("warning");
    });

    it("should return error for other errors", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "Unauthorized",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorToastType(response)).toBe("error");
    });
  });

  describe("getErrorTitle", () => {
    it("should return 'Rate Limit Exceeded' for 429", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 429,
        message: "Rate limit exceeded",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorTitle(response)).toBe("Rate Limit Exceeded");
    });

    it("should return 'Session Expired' for token revocation", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "User token has been revoked",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorTitle(response)).toBe("Session Expired");
    });

    it("should return 'Unauthorized' for 401", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 401,
        message: "Unauthorized",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorTitle(response)).toBe("Unauthorized");
    });

    it("should return 'Access Denied' for 403", () => {
      const response: ApiResponse<any> = {
        success: false,
        status: 403,
        message: "Forbidden",
        data: null,
        fieldErrors: {},
      };
      expect(getErrorTitle(response)).toBe("Access Denied");
    });
  });
});

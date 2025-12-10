/**
 * @jest-environment node
 */
import { GET, OPTIONS } from "../route";
import { NextResponse } from "next/server";

describe("/api/translations route", () => {
  describe("OPTIONS", () => {
    it("should return CORS headers", async () => {
      const response = await OPTIONS();
      const json = await response.json();

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, OPTIONS");
      expect(response.headers.get("Access-Control-Allow-Headers")).toBe("Content-Type");
      expect(json).toEqual({});
    });
  });

  describe("GET", () => {
    it("should return supported languages", async () => {
      const response = await GET();
      const json = await response.json();

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual({
        languages: [
          {
            code: "en",
            name: "English",
            nativeName: "English",
          },
          {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
          },
        ],
      });
    });
  });
});


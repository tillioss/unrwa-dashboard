/**
 * @jest-environment node
 */
import { GET, OPTIONS } from "../route";
import { NextResponse } from "next/server";
import ar from "@/lib/locales/ar.json";
import en from "@/lib/locales/en.json";

describe("/api/translations/[lang] route", () => {
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
    it("should return English translations", async () => {
      const request = new Request("http://localhost/api/translations/en");
      const params = Promise.resolve({ lang: "en" });

      const response = await GET(request, { params });
      const json = await response.json();

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual(en);
    });

    it("should return Arabic translations", async () => {
      const request = new Request("http://localhost/api/translations/ar");
      const params = Promise.resolve({ lang: "ar" });

      const response = await GET(request, { params });
      const json = await response.json();

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual(ar);
    });

    it("should return 404 for unsupported language", async () => {
      const request = new Request("http://localhost/api/translations/fr");
      const params = Promise.resolve({ lang: "fr" });

      const response = await GET(request, { params });
      const json = await response.json();

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(404);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual({
        error: "Language not supported",
      });
    });

    it("should handle empty language code", async () => {
      const request = new Request("http://localhost/api/translations/");
      const params = Promise.resolve({ lang: "" });

      const response = await GET(request, { params });
      const json = await response.json();

      expect(response.status).toBe(404);
      expect(json).toEqual({
        error: "Language not supported",
      });
    });
  });
});


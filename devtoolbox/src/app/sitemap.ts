import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://devtoolbox.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/json-formatter",
    "/base64",
    "/password-generator",
    "/qr-code",
    "/color-converter",
    "/hash-generator",
    "/url-encoder",
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${BASE_URL}${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    { url: `${site.url}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = site.work.projects.map((project) => ({
    url: `${site.url}/work/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}

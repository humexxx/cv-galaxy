import { cache } from "react";
import { getCVByUsername } from "@/lib/services/cv-service";
import { PreferencesServerService } from "@/lib/services/preferences-server-service";
import { getBaseUrl } from "@/lib/env";
import { notFound } from "next/navigation";
import { CVContent } from "@/components/cv-content";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

const getPreferences = cache((username: string) =>
  PreferencesServerService.getPreferencesFromDB(username)
);

/**
 * `generateMetadata` and the page render in the same request, so both must call
 * `getCVByUsername` with *identical* arguments for React's `cache()` to collapse
 * them into one DB round-trip. Hence the shared preference lookup.
 */
const getCV = cache(async (username: string) => {
  const preferences = await getPreferences(username);
  return getCVByUsername(username, preferences.showContractors);
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const cv = await getCV(username);

  if (!cv) {
    return {
      title: "CV Not Found",
    };
  }

  const baseUrl = getBaseUrl();

  // Optimize title length (50-60 characters ideal)
  const title = `${cv.fullName} | ${cv.title} | CV Galaxy`;

  // Optimize description length (110-160 characters ideal)
  const technologies = cv.technologies.slice(0, 3).join(", ");
  const shortDescription =
    cv.about.length > 100 ? `${cv.about.slice(0, 100)}...` : cv.about;
  const description = `${cv.title} specializing in ${technologies}. View full CV and experience.`;

  // Full description for social cards (still keep it reasonable)
  const fullDescription = `${shortDescription} | Skills: ${technologies}`;

  const url = `${baseUrl}/${username}`;
  const ogImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}`;

  return {
    title,
    description,
    authors: [{ name: cv.fullName }],
    openGraph: {
      title,
      description: fullDescription,
      url,
      siteName: "CV Galaxy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${cv.fullName} - ${cv.title}`,
          type: "image/png",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fullDescription,
      images: [ogImageUrl],
      creator: `@${username}`,
    },
    other: {
      // Meta tags explícitos para WhatsApp y redes sociales
      "og:image": ogImageUrl,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
      "og:image:alt": `${cv.fullName} - ${cv.title}`,
    },
  };
}

export default async function CVPage({ params }: PageProps) {
  const { username } = await params;

  const [preferences, cv] = await Promise.all([
    getPreferences(username),
    getCV(username),
  ]);

  if (!cv) {
    notFound();
  }

  return <CVContent username={username} cv={cv} initialShowContractors={preferences.showContractors} />;
}

export const revalidate = false;

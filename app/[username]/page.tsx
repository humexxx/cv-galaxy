import { getCVByUsername } from "@/data/cvs";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Code,
  Languages,
  Award,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadPdfButton } from "@/components/download-pdf-button";
import { Separator } from "@/components/ui/separator";
import { WorkExperienceSection } from "@/components/work-experience-section";
import {
  TypographyH1,
  TypographyLead,
  TypographyH3,
  TypographyMuted,
} from "@/components/ui/typography";
import { CvWithChatLayout } from "@/components/cv-with-chat-layout";
import { CVHighlightProvider } from "@/components/cv-highlight-provider";
import { HighlightedText } from "@/components/highlighted-text";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const cv = getCVByUsername(username);

  if (!cv) {
    return {
      title: "CV Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
      type: "article",
      publishedTime: new Date().toISOString(),
      authors: [cv.fullName],
      tags: cv.technologies,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fullDescription,
      images: [ogImageUrl],
      creator: `@${username}`,
    },
    // Additional metadata for Pinterest Rich Pins
    other: {
      "article:author": cv.fullName,
      "article:published_time": new Date().toISOString(),
      "pinterest:description": description,
    },
  };
}

export default async function CVPage({ params }: PageProps) {
  const { username } = await params;
  const cv = getCVByUsername(username);

  if (!cv) {
    notFound();
  }

  return (
    <CVHighlightProvider>
      <CvWithChatLayout userId={username} cvData={cv}>
        <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-6xl text-sm sm:text-base">
          {/* Header Section */}
          <div className="mb-4 sm:mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                {cv.avatar && (
                  <div className="shrink-0">
                    <Image
                      src={cv.avatar}
                      alt={cv.fullName}
                      width={128}
                      height={128}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-border"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <TypographyH1 className="mb-2">{cv.fullName}</TypographyH1>
                  <TypographyLead className="mb-4">{cv.title}</TypographyLead>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      {cv.contact.email && (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <a
                            href={`mailto:${cv.contact.email}`}
                            className="hover:text-foreground transition-colors break-all"
                          >
                            {cv.contact.email}
                          </a>
                        </div>
                      )}
                      {cv.contact.phone && (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <span>{cv.contact.phone}</span>
                        </div>
                      )}
                      {cv.contact.location && (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <span>{cv.contact.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="sm:hidden">
                      <DownloadPdfButton userId={username} />
                    </div>
                    <div className="hidden sm:block">
                      <DownloadPdfButton userId={username} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TypographyMuted className="leading-relaxed">
                  <HighlightedText text={cv.about} />
                </TypographyMuted>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-8">
              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Code className="h-5 w-5" />
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {cv.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        <HighlightedText text={tech} />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Languages className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cv.languages.map((lang) => (
                      <TypographyMuted key={lang} className="leading-relaxed">
                        <HighlightedText text={lang} />
                      </TypographyMuted>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cv.skills.map((skill) => (
                      <li key={skill} className="flex gap-2">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <TypographyMuted className="flex-1 leading-relaxed">
                          <HighlightedText text={skill} />
                        </TypographyMuted>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-4 sm:space-y-8">
              {/* Work Experience */}
              <WorkExperienceSection workExperience={cv.workExperience} />

              {/* Projects */}
              {cv.projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cv.projects.map((project, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <TypographyH3 className="text-lg">
                              <HighlightedText text={project.title} />
                            </TypographyH3>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <TypographyMuted>
                            <HighlightedText text={project.description} />
                          </TypographyMuted>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Personal Values */}
              {cv.personalValues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>What to Expect From Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cv.personalValues.map((value, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <TypographyMuted>
                          <HighlightedText text={value} />
                        </TypographyMuted>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </CvWithChatLayout>
    </CVHighlightProvider>
  );
}

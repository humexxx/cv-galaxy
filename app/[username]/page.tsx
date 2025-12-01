import { getCVByUsername } from "@/data/cvs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Mail, Phone, MapPin, Briefcase, Code, Languages, Award, Lightbulb, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CompanyAvatar } from "@/components/company-avatar";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function CVPage({ params }: PageProps) {
  const { username } = await params;
  const cv = getCVByUsername(username);

  if (!cv) {
    notFound();
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
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
              <h1 className="text-4xl font-bold mb-2">{cv.fullName}</h1>
              <p className="text-xl text-muted-foreground mb-4">{cv.title}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {cv.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${cv.contact.email}`} className="hover:text-foreground transition-colors">
                      {cv.contact.email}
                    </a>
                  </div>
                )}
                {cv.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{cv.contact.phone}</span>
                  </div>
                )}
                {cv.contact.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{cv.contact.location}</span>
                  </div>
                )}
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
              <p className="text-muted-foreground leading-relaxed">{cv.about}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5" />
                  Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cv.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
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
                    <div key={lang} className="text-sm">
                      {lang}
                    </div>
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
                <div className="space-y-2">
                  {cv.skills.map((skill) => (
                    <div key={skill} className="text-sm">
                      • {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cv.workExperience.map((exp, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex gap-4">
                      <CompanyAvatar 
                        company={exp.company} 
                        contractor={exp.contractor}
                        size={48} 
                      />
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="font-semibold text-lg">{exp.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="font-medium">{exp.company.name}</span>
                            {exp.contractor && (
                              <>
                                <span>via</span>
                                <span className="font-medium">{exp.contractor.name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>
                              {exp.period.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                              {exp.period.end === "Present" 
                                ? "Present" 
                                : exp.period.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                        <ul className="space-y-1 text-sm">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                          <h3 className="font-semibold">{project.title}</h3>
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
                        <p className="text-sm text-muted-foreground">{project.description}</p>
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
                      <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

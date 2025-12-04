"use client";

import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { HighlightedText } from "@/components/highlighted-text";
import type { CVData } from "@/types/cv";

interface EducationSectionProps {
  education: CVData["education"];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="space-y-3">
            <div>
              <TypographyH3 className="text-lg">
                <HighlightedText text={edu.degree} />
              </TypographyH3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="font-medium">
                  <HighlightedText text={edu.institution.name} />
                </span>
                <span>•</span>
                <span>
                  {edu.period.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                  {edu.period.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            <TypographyMuted>
              <HighlightedText text={edu.description} />
            </TypographyMuted>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

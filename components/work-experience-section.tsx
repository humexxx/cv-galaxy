"use client";

import { useState } from "react";
import { Briefcase, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyAvatar } from "@/components/company-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { HighlightedText } from "@/components/highlighted-text";
import { ContractorToggle } from "@/components/contractor-toggle";
import { EditWorkExperienceDialog } from "@/components/edit-work-experience-dialog";
import { useAuth } from "@/components/auth-provider";
import type { CVData, WorkExperience } from "@/types/cv";

interface WorkExperienceSectionProps {
  workExperience: CVData["workExperience"];
  showContractors?: boolean;
  username: string;
  onToggle: (show: boolean) => void;
}

interface WorkExperienceItemProps {
  exp: WorkExperience;
  showContractors: boolean;
  isOwner: boolean;
  username: string;
}

function WorkExperienceItem({
  exp,
  showContractors,
  isOwner,
  username,
}: WorkExperienceItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <CompanyAvatar
        company={exp.company}
        contractor={exp.contractor}
        size={48}
        showContractor={showContractors}
      />
      <div className="space-y-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <TypographyH3 className="text-lg">
              <HighlightedText text={exp.title} />
            </TypographyH3>
            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setDialogOpen(true)}
                  aria-label="Edit work experience"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <EditWorkExperienceDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  workExperience={exp}
                  username={username}
                />
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="font-medium">
              <HighlightedText text={exp.company.name} />
            </span>
            {showContractors && exp.contractor && (
              <>
                <span>via</span>
                <span className="font-medium">{exp.contractor.name}</span>
              </>
            )}
            <span>•</span>
            <span>
              {exp.period.start.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}{" "}
              -{" "}
              {exp.period.end === "Present"
                ? "Present"
                : exp.period.end.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
            </span>
          </div>
        </div>
        <TypographyMuted>
          <HighlightedText text={exp.description} />
        </TypographyMuted>
        <div
          className="prose prose-sm dark:prose-invert max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: exp.responsibilitiesHtml ?? "" }}
        />
      </div>
    </div>
  );
}

export function WorkExperienceSection({
  workExperience,
  showContractors = true,
  username,
  onToggle,
}: WorkExperienceSectionProps) {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );
  const { user } = useAuth();
  const isOwner = user?.username === username;

  // Show first 2 always expanded, rest in accordion
  const alwaysVisible = workExperience.slice(0, 2);
  const collapsible = workExperience.slice(2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
          <ContractorToggle username={username} onToggle={onToggle} />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-8">
          {alwaysVisible.map((exp) => (
            <WorkExperienceItem
              key={exp.id}
              exp={exp}
              showContractors={showContractors}
              isOwner={isOwner}
              username={username}
            />
          ))}
        </div>

        {collapsible.length > 0 && (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={accordionValue}
            onValueChange={setAccordionValue}
          >
            <AccordionItem value="more-experience" className="border-none">
              <AccordionTrigger className="text-base font-medium cursor-pointer hover:no-underline py-4">
                {accordionValue === "more-experience"
                  ? `Hide ${collapsible.length} previous ${
                      collapsible.length === 1 ? "experience" : "experiences"
                    }`
                  : `Show ${collapsible.length} more ${
                      collapsible.length === 1 ? "experience" : "experiences"
                    }`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-8 pt-4">
                  {collapsible.map((exp) => (
                    <WorkExperienceItem
                      key={exp.id}
                      exp={exp}
                      showContractors={showContractors}
                      isOwner={isOwner}
                      username={username}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}


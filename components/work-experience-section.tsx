"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { CVData } from "@/types/cv";

interface WorkExperienceSectionProps {
  workExperience: CVData["workExperience"];
  showContractors?: boolean;
  username: string;
  onToggle: (show: boolean) => void;
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
        {/* First 2 jobs always visible */}
        <div className="space-y-8">
          {alwaysVisible.map((exp, index) => (
            <div key={index} className="flex gap-4">
              <CompanyAvatar
                company={exp.company}
                contractor={exp.contractor}
                size={48}
                showContractor={showContractors}
              />
              <div className="space-y-3 flex-1">
                <div>
                  <TypographyH3 className="text-lg">
                    <HighlightedText text={exp.title} />
                  </TypographyH3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="font-medium">
                      <HighlightedText text={exp.company.name} />
                    </span>
                    {showContractors && exp.contractor && (
                      <>
                        <span>via</span>
                        <span className="font-medium">
                          {exp.contractor.name}
                        </span>
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
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm leading-relaxed"
                    >
                      <span className="text-muted-foreground mt-0.5">•</span>
                      <span className="flex-1">
                        <HighlightedText text={resp} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                  {collapsible.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <CompanyAvatar
                        company={exp.company}
                        contractor={exp.contractor}
                        size={48}
                        showContractor={showContractors}
                      />
                      <div className="space-y-3 flex-1">
                        <div>
                          <TypographyH3 className="text-lg">
                            <HighlightedText text={exp.title} />
                          </TypographyH3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="font-medium">
                              <HighlightedText text={exp.company.name} />
                            </span>
                            {showContractors && exp.contractor && (
                              <>
                                <span>via</span>
                                <span className="font-medium">
                                  {exp.contractor.name}
                                </span>
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
                        <ul className="space-y-2">
                          {exp.responsibilities.map((resp, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm leading-relaxed"
                            >
                              <span className="text-muted-foreground mt-0.5">
                                •
                              </span>
                              <span className="flex-1">
                                <HighlightedText text={resp} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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

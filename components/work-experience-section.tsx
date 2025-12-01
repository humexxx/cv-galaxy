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
import type { CVData } from "@/types/cv";

interface WorkExperienceSectionProps {
  workExperience: CVData["workExperience"];
}

export function WorkExperienceSection({ workExperience }: WorkExperienceSectionProps) {
  // Mostrar los primeros 2 siempre expandidos, el resto en accordion
  const alwaysVisible = workExperience.slice(0, 2);
  const collapsible = workExperience.slice(2);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Primeros 2 trabajos siempre visibles */}
        <div className="space-y-8">
          {alwaysVisible.map((exp, index) => (
            <div key={index} className="flex gap-4">
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
          ))}
        </div>

        {/* Resto de trabajos en accordion */}
        {collapsible.length > 0 && (
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={accordionValue}
            onValueChange={setAccordionValue}
          >
            <AccordionItem value="more-experience" className="border-none">
              <AccordionTrigger 
                className="text-base font-medium cursor-pointer hover:no-underline py-4"
              >
                {accordionValue === "more-experience" 
                  ? `Hide ${collapsible.length} previous ${collapsible.length === 1 ? 'experience' : 'experiences'}`
                  : `Show ${collapsible.length} more ${collapsible.length === 1 ? 'experience' : 'experiences'}`
                }
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-8 pt-4">
                  {collapsible.map((exp, index) => (
                    <div key={index} className="flex gap-4">
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

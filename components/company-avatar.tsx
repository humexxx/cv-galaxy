import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Company } from "@/types/cv";

interface CompanyAvatarProps {
  company: Company;
  contractor?: Company;
  size?: number;
}

function SingleAvatar({ 
  company, 
  size, 
  className = "" 
}: { 
  company: Company;
  size: number; 
  className?: string;
}) {
  const logo = company.logo;

  const avatarContent = logo ? (
    <div
      className={`shrink-0 overflow-hidden rounded-lg border bg-background ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logo}
        alt={`${company.name} logo`}
        width={size}
        height={size}
        className="object-contain p-2"
      />
    </div>
  ) : (
    // Generic avatar with company initial
    <div
      className={`shrink-0 flex items-center justify-center rounded-lg border bg-muted text-muted-foreground font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {company.name.charAt(0).toUpperCase()}
    </div>
  );

  const content = company.website ? (
    <a 
      href={company.website} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
    >
      {avatarContent}
    </a>
  ) : (
    avatarContent
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{company.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function CompanyAvatar({ 
  company, 
  contractor, 
  size = 48 
}: CompanyAvatarProps) {
  // If no contractor, show single avatar
  if (!contractor) {
    return <SingleAvatar company={company} size={size} />;
  }

  // Stacked avatars when contractor exists
  const contractorSize = size * 0.65; // Contractor avatar is 65% of main size
  const gap = 8; // 8px gap between avatars
  
  return (
    <div className="shrink-0 flex flex-col items-center" style={{ gap: `${gap}px` }}>
      {/* Client company avatar (top, full size) */}
      <SingleAvatar company={company} size={size} />
      
      {/* Contractor avatar (bottom, smaller) */}
      <SingleAvatar company={contractor} size={contractorSize} />
    </div>
  );
}

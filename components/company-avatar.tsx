import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompanyAvatarProps {
  company: string;
  companyWebsite?: string;
  contractor?: string;
  contractorWebsite?: string;
  size?: number;
}

const companyLogos: Record<string, string> = {
  Intel: "/images/companies/intel.svg",
  PayPal: "/images/companies/paypal.svg",
  Silac: "/images/companies/silac.png",
  Tech9: "/images/companies/tech9.svg",
  Altimetrik: "/images/companies/altimetrik.png",
  Avionyx: "/images/companies/avionyx.avif",
  JustServe: "/images/companies/justserve.svg",
  // Add more company logos here as needed
};

function SingleAvatar({ 
  company, 
  website,
  size, 
  className = "" 
}: { 
  company: string;
  website?: string;
  size: number; 
  className?: string;
}) {
  const logo = companyLogos[company];

  const avatarContent = logo ? (
    <div
      className={`shrink-0 overflow-hidden rounded-lg border bg-background ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logo}
        alt={`${company} logo`}
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
      {company.charAt(0).toUpperCase()}
    </div>
  );

  const content = website ? (
    <a 
      href={website} 
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
          <p>{company}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function CompanyAvatar({ 
  company, 
  companyWebsite, 
  contractor, 
  contractorWebsite, 
  size = 48 
}: CompanyAvatarProps) {
  // If no contractor, show single avatar
  if (!contractor) {
    return <SingleAvatar company={company} website={companyWebsite} size={size} />;
  }

  // Stacked avatars when contractor exists
  const contractorSize = size * 0.65; // Contractor avatar is 65% of main size
  const gap = 8; // 8px gap between avatars
  
  return (
    <div className="shrink-0 flex flex-col items-center" style={{ gap: `${gap}px` }}>
      {/* Client company avatar (top, full size) */}
      <SingleAvatar company={company} website={companyWebsite} size={size} />
      
      {/* Contractor avatar (bottom, smaller) */}
      <SingleAvatar company={contractor} website={contractorWebsite} size={contractorSize} />
    </div>
  );
}

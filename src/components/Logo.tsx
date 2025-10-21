import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  linkToHome?: boolean;
  className?: string;
}

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/nhbea-64cab.firebasestorage.app/o/public%2FNHBEALogo.png?alt=media&token=1baf76d5-7b58-4cf2-8023-f153330b09c1';

export default function Logo({ 
  variant = 'default',
  size = 'md',
  showText = true,
  linkToHome = true,
  className = ''
}: LogoProps) {
  // Size configurations - optimized for better visual balance
  const sizeConfig = {
    xs: { width: 32, height: 32, textSize: 'text-base' },
    sm: { width: 40, height: 40, textSize: 'text-lg' },
    md: { width: 56, height: 56, textSize: 'text-xl' },
    lg: { width: 72, height: 72, textSize: 'text-2xl' },
    xl: { width: 88, height: 88, textSize: 'text-3xl' }
  };

  const { width, height, textSize } = sizeConfig[size];

  // Color configurations based on variant
  const colorConfig = {
    default: {
      textColor: 'text-[var(--nhbea-royal-blue)]',
      hoverColor: 'hover:text-[var(--nhbea-royal-blue-dark)]'
    },
    white: {
      textColor: 'text-[var(--nhbea-gray-50)]',
      hoverColor: 'hover:text-[var(--nhbea-gray-50)]/90'
    }
  };

  const { textColor, hoverColor } = colorConfig[variant];

  const LogoContent = () => (
    <div className={`flex items-center ${size === 'xs' || size === 'sm' ? 'gap-3' : 'gap-4'} ${className}`}>
      {/* Logo Image */}
      <div className="relative flex-shrink-0">
        <Image
          src={LOGO_URL}
          alt="NHBEA Logo"
          width={width}
          height={height}
          className="object-contain drop-shadow-sm"
          priority={size === 'lg' || size === 'xl'}
        />
      </div>
      
      {/* Optional Text */}
      {showText && (
        <div className={`font-bold ${textSize} ${textColor} leading-tight`}>
          <div className="tracking-tight">NHBEA</div>
          {size === 'lg' || size === 'xl' ? (
            <div className="text-sm font-medium text-current opacity-75 leading-none mt-1">
              Business Education Association
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link 
        href="/" 
        className={`inline-flex transition-all duration-200 ${hoverColor} hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)]/30 focus:ring-offset-2 rounded-lg p-1`}
        aria-label="Go to NHBEA homepage"
      >
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

// Specialized logo variants for common use cases
export function HeaderLogo({ className }: { className?: string }) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      {/* Consistent header logo across all screen sizes - optimized for navigation bar */}
      <Logo
        size="sm"
        showText={true}
        linkToHome={true}
        variant="default"
        className="max-h-12"
      />
    </div>
  );
}

export function FooterLogo({ className }: { className?: string }) {
  return (
    <Logo
      size="lg"
      showText={true}
      linkToHome={true}
      variant="white"
      className={className}
    />
  );
}

export function HeroLogo({ className }: { className?: string }) {
  return (
    <Logo
      size="xl"
      showText={true}
      linkToHome={false}
      variant="white"
      className={className}
    />
  );
}
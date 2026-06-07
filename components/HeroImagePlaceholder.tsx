import Image from "next/image";

type HeroImagePlaceholderProps = {
  label: string;
  src?: string;
};

export default function HeroImagePlaceholder({ label, src }: HeroImagePlaceholderProps) {
  return (
    <div className="hero-img" aria-label={label}>
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="hero-photo"
        />
      ) : (
        <div className="ph-c">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="m21 16-4.5-4.5L7 21" />
          </svg>
          {label}
        </div>
      )}
    </div>
  );
}

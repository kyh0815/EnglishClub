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
      ) : null}
      {src ? null : (
        <div className="ph-c">
          <span className="sr-only">{label}</span>
        </div>
      )}
    </div>
  );
}

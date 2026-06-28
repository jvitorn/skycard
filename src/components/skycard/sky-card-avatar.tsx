import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name
    .replace(/^@/, "")
    .split(/\s+|\./)
    .filter(Boolean);

  const first = parts[0] ? Array.from(parts[0]) : [];
  const second = parts[1] ? Array.from(parts[1]) : [];

  return (first[0] || "S") + (second[0] || first[1] || "C");
}

export function SkyCardAvatar({
  name,
  avatar,
  alt,
  className,
}: {
  name: string;
  avatar?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-full border-[3px] border-[var(--bd)] bg-[linear-gradient(140deg,var(--accent),var(--accent2))] shadow-[0_0_35px_rgba(86,214,255,.22)] ring-2 ring-white/15",
        className
      )}
    >
      <Avatar className="size-full rounded-full">
        <AvatarImage src={avatar} alt={alt} crossOrigin="anonymous" className="size-full object-cover" />
        <AvatarFallback className="size-full bg-transparent font-heading text-2xl font-black text-[#06101f]">
          {initials(name).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

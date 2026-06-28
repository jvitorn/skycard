import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BadgeId } from "@/lib/bluesky/types";
import { cn } from "@/lib/utils";

export function CardBadges({
  badges,
  limit,
  className,
}: {
  badges: BadgeId[];
  limit?: number;
  className?: string;
}) {
  const t = useTranslations();
  const visible = typeof limit === "number" ? badges.slice(0, limit) : badges;

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((badge) => (
        <Badge key={badge} variant="secondary" className="normal-case">
          <Sparkles className="size-3" />
          {t(`badges.${badge}.name`)}
        </Badge>
      ))}
    </div>
  );
}

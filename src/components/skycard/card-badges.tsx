import { useTranslations } from "next-intl";
import {
  CalendarCheck2,
  Crown,
  Flame,
  MessagesSquare,
  Sprout,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BadgeId } from "@/lib/bluesky/types";
import { cn } from "@/lib/utils";

const badgeIcons: Record<BadgeId, LucideIcon> = {
  "legacy-member": Crown,
  "viral-spark": Flame,
  "conversation-starter": MessagesSquare,
  "consistent-player": CalendarCheck2,
  "community-builder": UsersRound,
  rookie: Sprout,
};

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
      {visible.map((badge) => {
        const Icon = badgeIcons[badge];

        return (
          <Badge key={badge} variant="secondary" className="normal-case">
            <Icon className="size-3" />
            {t(`badges.${badge}.name`)}
          </Badge>
        );
      })}
    </div>
  );
}

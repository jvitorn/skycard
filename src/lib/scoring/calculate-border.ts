import type { SkyCardPresentation } from "@/lib/bluesky/types";

export function calculateBorder(
  createdAt: string | undefined,
  now = new Date()
): Pick<SkyCardPresentation, "border" | "joinedYear"> {
  if (!createdAt) {
    return {
      border: "established",
    };
  }

  const created = new Date(createdAt);

  if (Number.isNaN(created.getTime())) {
    return {
      border: "established",
    };
  }

  const days = (now.getTime() - created.getTime()) / (24 * 60 * 60 * 1000);
  const joinedYear = created.getUTCFullYear();

  if (days < 90) {
    return {
      border: "rookie",
      joinedYear,
    };
  }

  if (days < 365) {
    return {
      border: "rising",
      joinedYear,
    };
  }

  if (days < 365 * 2) {
    return {
      border: "established",
      joinedYear,
    };
  }

  if (days < 365 * 3) {
    return {
      border: "veteran",
      joinedYear,
    };
  }

  return {
    border: "legacy",
    joinedYear,
  };
}

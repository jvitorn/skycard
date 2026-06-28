import { z } from "zod";

import { SkyCardError } from "./errors";

const didPattern = /^did:[a-z0-9]+:[a-zA-Z0-9._:%-]+$/;
const handlePattern =
  /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{1,62}$/;

export function normalizeActorInput(input: string): string {
  let value = input.trim();

  if (!value) {
    throw new SkyCardError("invalid_actor", "Empty actor input");
  }

  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    if (host !== "bsky.app" && host !== "www.bsky.app") {
      throw new SkyCardError("invalid_actor", "Only bsky.app URLs are supported");
    }

    if (url.search || url.hash) {
      throw new SkyCardError("invalid_actor", "Profile URL cannot include query or hash");
    }

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length !== 2 || segments[0] !== "profile") {
      throw new SkyCardError("invalid_actor", "Unsupported Bluesky profile URL");
    }

    value = decodeURIComponent(segments[1]);
  }

  value = value.replace(/^@/, "").trim();

  if (!value) {
    throw new SkyCardError("invalid_actor", "Empty actor input");
  }

  if (didPattern.test(value)) {
    return value;
  }

  if (value.includes("/") || value.includes("?") || value.includes("#")) {
    throw new SkyCardError("invalid_actor", "Actor cannot include path or query data");
  }

  const handle = value.toLowerCase();

  if (!handlePattern.test(handle)) {
    throw new SkyCardError("invalid_actor", "Invalid Bluesky handle");
  }

  return handle;
}

export const actorInputSchema = z
  .string()
  .trim()
  .min(1)
  .superRefine((value, ctx) => {
    try {
      normalizeActorInput(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Bluesky actor",
      });
    }
  })
  .transform((value) => normalizeActorInput(value));

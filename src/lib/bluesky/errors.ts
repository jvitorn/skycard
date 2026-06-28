export type SkyCardErrorCode =
  | "invalid_actor"
  | "not_found"
  | "rate_limited"
  | "unavailable"
  | "timeout"
  | "invalid_response"
  | "public_opt_out"
  | "thin_profile";

export class SkyCardError extends Error {
  constructor(
    public readonly code: SkyCardErrorCode,
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "SkyCardError";
  }
}

export function isSkyCardError(error: unknown): error is SkyCardError {
  return error instanceof SkyCardError;
}

export type H3Resolution = '768P' | '2K';

// One credit is sold for roughly US$0.01. These rates keep revenue above
// 3x MiniMax's public PAYG cost, including the best-value credit pack.
export const H3_CREDITS_PER_SECOND: Record<H3Resolution, number> = {
  '768P': 25,
  '2K': 40,
};

export const H3_CREDITS_PER_EXTRA_IMAGE = 10;
export const H3_MAX_REFERENCE_VIDEO_SECONDS = 15;

export function getH3OutputCredits(resolution: H3Resolution, duration: number) {
  return H3_CREDITS_PER_SECOND[resolution] * duration;
}

export function getH3ReservedCredits({
  resolution,
  duration,
  referenceVideoCount = 0,
  referenceImageCount = 0,
}: {
  resolution: H3Resolution;
  duration: number;
  referenceVideoCount?: number;
  referenceImageCount?: number;
}) {
  const billableSeconds =
    duration + (referenceVideoCount > 0 ? H3_MAX_REFERENCE_VIDEO_SECONDS : 0);
  const extraImages = Math.max(0, referenceImageCount - 5);
  return (
    billableSeconds * H3_CREDITS_PER_SECOND[resolution] +
    extraImages * H3_CREDITS_PER_EXTRA_IMAGE
  );
}

export function getH3ActualCredits({
  resolution,
  duration,
  usage,
}: {
  resolution: H3Resolution;
  duration: number;
  usage?: Record<string, unknown> | null;
}) {
  const totalSeconds = Number(usage?.total_seconds);
  const inputImageCount = Number(usage?.input_image_count);
  const billableSeconds =
    Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : duration;
  const extraImages =
    Number.isFinite(inputImageCount) && inputImageCount > 5
      ? inputImageCount - 5
      : 0;
  return Math.ceil(
    billableSeconds * H3_CREDITS_PER_SECOND[resolution] +
      extraImages * H3_CREDITS_PER_EXTRA_IMAGE
  );
}

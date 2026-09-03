"use client";

import { FormattedText } from "@/components/formatted-text";

interface ImagePreviewProps {
  imageSrc: string;
  title: string;
  description: string;
  compact?: boolean;
  showPlaceholders?: boolean;
}

export function ImagePreview({
  imageSrc,
  title,
  description,
  compact = false,
  showPlaceholders = false,
}: ImagePreviewProps) {
  return (
    <article className="space-y-4">
      {title ? (
        <FormattedText
          as="h1"
          text={title}
          className={
            compact
              ? "text-center text-xl font-semibold tracking-tight"
              : "text-center text-3xl font-semibold tracking-tight"
          }
        />
      ) : showPlaceholders ? (
        <p className="text-center text-sm text-muted-foreground">
          El título va a aparecer acá
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border bg-muted/20">
        <img
          src={imageSrc}
          alt={title || "Imagen"}
          className={
            compact
              ? "mx-auto max-h-[240px] w-full object-contain"
              : "mx-auto max-h-[80vh] w-full object-contain"
          }
        />
      </div>

      {description ? (
        <FormattedText
          as="p"
          text={description}
          className="text-center text-muted-foreground"
        />
      ) : showPlaceholders ? (
        <p className="text-center text-sm text-muted-foreground">
          La descripción va a aparecer acá
        </p>
      ) : null}
    </article>
  );
}

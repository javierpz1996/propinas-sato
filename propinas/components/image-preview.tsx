"use client";

import { FormattedText } from "@/components/formatted-text";
import { fontFamilyCss, type SiteFontId } from "@/lib/site-fonts";

interface ImagePreviewProps {
  imageSrc: string;
  title: string;
  description: string;
  compact?: boolean;
  showPlaceholders?: boolean;
  titleColor?: string;
  descriptionColor?: string;
  titleFont?: SiteFontId;
  descriptionFont?: SiteFontId;
}

export function ImagePreview({
  imageSrc,
  title,
  description,
  compact = false,
  showPlaceholders = false,
  titleColor,
  descriptionColor,
  titleFont,
  descriptionFont,
}: ImagePreviewProps) {
  return (
    <article
      className={compact ? "mx-auto w-full max-w-md space-y-4" : "space-y-4"}
    >
      {title ? (
        <FormattedText
          as="h1"
          text={title}
          color={titleColor}
          fontFamily={fontFamilyCss(titleFont)}
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

      {imageSrc ? (
        <div className="overflow-hidden">
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
      ) : showPlaceholders ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Foto de ejemplo
        </div>
      ) : null}

      {description ? (
        <FormattedText
          as="p"
          text={description}
          color={descriptionColor}
          fontFamily={fontFamilyCss(descriptionFont)}
          className="text-center"
        />
      ) : showPlaceholders ? (
        <p className="text-center text-sm text-muted-foreground">
          La descripción va a aparecer acá
        </p>
      ) : null}
    </article>
  );
}

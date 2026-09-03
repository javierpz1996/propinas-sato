"use client";

import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailShell } from "@/components/detail-shell";
import { ImagePreview } from "@/components/image-preview";
import type { SiteFontId } from "@/lib/site-fonts";

const EXAMPLE_TITLE = "Título de ejemplo";
const EXAMPLE_DESCRIPTION = "Esta es una descripción de ejemplo.";

interface DetailPreviewCardProps {
  backgroundUrl: string | null;
  imageSrc?: string | null;
  title?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
  titleFont?: SiteFontId;
  descriptionFont?: SiteFontId;
  pendingFile: boolean;
  saving: boolean;
  onApply: () => Promise<void>;
  onClear: () => Promise<void>;
  canClear: boolean;
}

export function DetailPreviewCard({
  backgroundUrl,
  imageSrc,
  title,
  description,
  titleColor,
  descriptionColor,
  titleFont,
  descriptionFont,
  pendingFile,
  saving,
  onApply,
  onClear,
  canClear,
}: DetailPreviewCardProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium">Vista previa del post</p>
      <DetailShell backgroundUrl={backgroundUrl} compact>
        <ImagePreview
          imageSrc={imageSrc || ""}
          title={title?.trim() ? title : EXAMPLE_TITLE}
          description={
            description?.trim() ? description : EXAMPLE_DESCRIPTION
          }
          titleColor={titleColor}
          descriptionColor={descriptionColor}
          titleFont={titleFont}
          descriptionFont={descriptionFont}
          compact
        />
      </DetailShell>
      <div className="flex flex-wrap justify-center gap-2">
        {pendingFile ? (
          <Button onClick={onApply} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Aplicar fondo
              </>
            )}
          </Button>
        ) : null}
        {canClear && !pendingFile ? (
          <Button variant="destructive" onClick={onClear} disabled={saving}>
            <Trash2 className="size-4" />
            Quitar fondo
          </Button>
        ) : null}
      </div>
    </div>
  );
}

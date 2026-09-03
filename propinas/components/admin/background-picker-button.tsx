"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Wallpaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_UPLOAD_MB, isOverUploadLimit } from "@/lib/upload-limits";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

interface BackgroundPickerButtonProps {
  saving: boolean;
  onPick: (file: File) => void;
}

export function BackgroundPickerButton({
  saving,
  onPick,
}: BackgroundPickerButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError("Usá PNG, JPEG, WebP o GIF");
        return;
      }
      if (isOverUploadLimit(f)) {
        setError(`Máximo ${MAX_UPLOAD_MB} MB`);
        return;
      }
      onPick(f);
    },
    [onPick],
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        disabled={saving}
        onClick={() => inputRef.current?.click()}
      >
        {saving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wallpaper className="size-4" />
        )}
        Cambiar fondo de pantalla
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) handleFile(selected);
          e.target.value = "";
        }}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

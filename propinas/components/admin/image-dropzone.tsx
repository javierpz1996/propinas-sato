"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UploadPayload } from "@/hooks/use-supabase-storage";
import { RichTextField } from "@/components/admin/rich-text-field";
import type { SiteFontId } from "@/lib/site-fonts";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface ImageDraft {
  previewUrl: string | null;
  title: string;
  description: string;
}

interface ImageDropzoneProps {
  onUpload: (payload: UploadPayload) => Promise<void>;
  uploading: boolean;
  onDraftChange?: (draft: ImageDraft) => void;
  titleColor?: string;
  descriptionColor?: string;
  titleFont?: SiteFontId;
  descriptionFont?: SiteFontId;
  onTitleColorChange?: (color: string) => void;
  onDescriptionColorChange?: (color: string) => void;
  onTitleFontChange?: (font: SiteFontId) => void;
  onDescriptionFontChange?: (font: SiteFontId) => void;
  savingStyle?: boolean;
  onSaveStyle?: () => Promise<void>;
}

export function ImageDropzone({
  onUpload,
  uploading,
  onDraftChange,
  titleColor,
  descriptionColor,
  titleFont,
  descriptionFont,
  onTitleColorChange,
  onDescriptionColorChange,
  onTitleFontChange,
  onDescriptionFontChange,
  savingStyle,
  onSaveStyle,
}: ImageDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback((f: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Formato no soportado. Usa PNG, JPEG, WebP o GIF.");
      return;
    }

    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`El archivo supera el límite de ${MAX_SIZE_MB} MB.`);
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onDraftChange?.({ previewUrl: url, title, description });
  }, [title, description, onDraftChange]);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) validateAndSet(dropped);
    },
    [validateAndSet],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) validateAndSet(selected);
    },
    [validateAndSet],
  );

  const clearSelection = useCallback(() => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setTitle("");
    setDescription("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onDraftChange?.({ previewUrl: null, title: "", description: "" });
  }, [preview, onDraftChange]);

  const handleUpload = useCallback(async () => {
    if (!file) return;
    if (!title.trim()) {
      setError("Escribí un título para la imagen.");
      return;
    }
    await onUpload({ file, title, description });
    clearSelection();
  }, [file, title, description, onUpload, clearSelection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-5" />
          Subir nueva imagen
        </CardTitle>
        <CardDescription>
          Arrastra una imagen o haz clic para seleccionar un archivo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            )}
          >
            <div className="rounded-full bg-muted p-4">
              <ImageIcon className="size-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Arrastra tu imagen aquí</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPEG, WebP o GIF — máximo {MAX_SIZE_MB} MB
              </p>
            </div>
            <Button variant="outline" size="sm" type="button">
              Seleccionar imagen
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <RichTextField
          id="image-title"
          label="Título"
          value={title}
          onChange={(value) => {
            setTitle(value);
            onDraftChange?.({
              previewUrl: preview,
              title: value,
              description,
            });
          }}
          placeholder="Título que se verá arriba de la foto"
          disabled={uploading}
          color={titleColor}
          onColorChange={onTitleColorChange}
          font={titleFont}
          onFontChange={onTitleFontChange}
        />

        <RichTextField
          id="image-description"
          label="Descripción"
          value={description}
          onChange={(value) => {
            setDescription(value);
            onDraftChange?.({
              previewUrl: preview,
              title,
              description: value,
            });
          }}
          placeholder="Texto que se verá debajo de la foto"
          disabled={uploading}
          multiline
          rows={4}
          color={descriptionColor}
          onColorChange={onDescriptionColorChange}
          font={descriptionFont}
          onFontChange={onDescriptionFontChange}
        />

        {onSaveStyle ? (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveStyle}
            disabled={savingStyle || uploading}
          >
            {savingStyle ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : (
              "Guardar colores y fuentes del post"
            )}
          </Button>
        ) : null}

        {file && preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearSelection}
                disabled={uploading}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearSelection}
                disabled={uploading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Subiendo…
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Subir imagen
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { PartyPopper, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RichTextField } from "@/components/admin/rich-text-field";
import { normalizeHexColor } from "@/lib/color";
import {
  DEFAULT_THANKS_BODY,
  DEFAULT_THANKS_MESSAGE,
  DEFAULT_THANKS_TITLE,
} from "@/lib/thanks-message";
import { MAX_UPLOAD_MB, isOverUploadLimit } from "@/lib/upload-limits";

export type ThanksEditorValue = {
  thanksTitle: string;
  thanksBody: string;
  thanksMessage: string;
  thanksTitleColor: string;
  thanksBodyColor: string;
  thanksMessageColor: string;
  thanksTitleFont: SiteFontId;
  thanksBodyFont: SiteFontId;
  thanksMessageFont: SiteFontId;
  thanksCardEnabled: boolean;
};

interface ThanksStyleEditorProps {
  value: ThanksEditorValue;
  imageUrl?: string | null;
  saving: boolean;
  onChange: (value: ThanksEditorValue) => void;
  onPickImage: (file: File) => void;
  onClearImage: () => void;
  onSave: (value: ThanksEditorValue) => Promise<void>;
}

export function ThanksStyleEditor({
  value,
  imageUrl,
  saving,
  onChange,
  onPickImage,
  onClearImage,
  onSave,
}: ThanksStyleEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [local, setLocal] = useState(value);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocal(value);
  }, [
    value.thanksTitle,
    value.thanksBody,
    value.thanksMessage,
    value.thanksTitleColor,
    value.thanksBodyColor,
    value.thanksMessageColor,
    value.thanksTitleFont,
    value.thanksBodyFont,
    value.thanksMessageFont,
    value.thanksCardEnabled,
  ]);

  function patch(next: Partial<ThanksEditorValue>) {
    const merged = { ...local, ...next };
    setLocal(merged);
    onChange(merged);
  }

  async function handleSave() {
    const title = normalizeHexColor(local.thanksTitleColor);
    const body = normalizeHexColor(local.thanksBodyColor);
    const message = normalizeHexColor(local.thanksMessageColor);
    if (!title || !body || !message) {
      setError("Usá colores hexadecimales de 6 dígitos, por ejemplo #171717");
      return;
    }
    setError(null);
    await onSave({
      ...local,
      thanksTitleColor: title,
      thanksBodyColor: body,
      thanksMessageColor: message,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PartyPopper className="size-5" />
          Texto de gracias
        </CardTitle>
        <CardDescription>
          Se guarda en el sitio y se mantiene hasta que lo edites de nuevo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={local.thanksCardEnabled}
            onChange={(e) => patch({ thanksCardEnabled: e.target.checked })}
            className="size-4 accent-[#1a73e8]"
          />
          Mostrar recuadro gris
        </label>

        <RichTextField
          id="thanks-title"
          label="Título"
          value={local.thanksTitle}
          onChange={(thanksTitle) => patch({ thanksTitle })}
          placeholder={DEFAULT_THANKS_TITLE}
          color={local.thanksTitleColor}
          onColorChange={(thanksTitleColor) => patch({ thanksTitleColor })}
          font={local.thanksTitleFont}
          onFontChange={(thanksTitleFont) => patch({ thanksTitleFont })}
        />

        <div className="space-y-1">
          <RichTextField
            id="thanks-body"
            label="Texto con el monto"
            value={local.thanksBody}
            onChange={(thanksBody) => patch({ thanksBody })}
            placeholder={DEFAULT_THANKS_BODY}
            color={local.thanksBodyColor}
            onColorChange={(thanksBodyColor) => patch({ thanksBodyColor })}
            font={local.thanksBodyFont}
            onFontChange={(thanksBodyFont) => patch({ thanksBodyFont })}
          />
          <p className="text-xs text-muted-foreground">
            Usá {"{monto}"} para mostrar el importe, por ejemplo $1.000.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Imagen debajo del monto</p>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Vista previa"
              className="max-h-40 w-full rounded-lg object-contain"
            />
          ) : (
            <p className="text-xs text-muted-foreground">
              Todavía no hay imagen. Se va a mostrar debajo del texto del monto.
            Máximo {MAX_UPLOAD_MB} MB.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              disabled={saving}
            >
              <Upload className="size-4" />
              {imageUrl ? "Cambiar imagen" : "Subir imagen"}
            </Button>
            {imageUrl ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onClearImage}
                disabled={saving}
              >
                <Trash2 className="size-4" />
                Quitar imagen
              </Button>
            ) : null}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (isOverUploadLimit(file)) {
                  setError(`La imagen supera el límite de ${MAX_UPLOAD_MB} MB.`);
                } else {
                  setError(null);
                  onPickImage(file);
                }
              }
              e.target.value = "";
            }}
          />
        </div>

        <RichTextField
          id="thanks-message"
          label="Mensaje de gracias"
          value={local.thanksMessage}
          onChange={(thanksMessage) => patch({ thanksMessage })}
          placeholder={DEFAULT_THANKS_MESSAGE}
          color={local.thanksMessageColor}
          onColorChange={(thanksMessageColor) => patch({ thanksMessageColor })}
          font={local.thanksMessageFont}
          onFontChange={(thanksMessageFont) => patch({ thanksMessageFont })}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando…
            </>
          ) : (
            "Guardar gracias"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

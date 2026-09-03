"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HexField } from "@/components/admin/hex-field";
import { RichTextField } from "@/components/admin/rich-text-field";
import { normalizeHexColor } from "@/lib/color";
import { DEFAULT_DONATION_COLOR } from "@/hooks/use-site-settings";
import type { SiteFontId } from "@/lib/site-fonts";

export type DonationEditorValue = {
  donationMessage: string;
  donationColor: string;
  donationMessageColor: string;
  donationMessageFont: SiteFontId;
};

interface DonationStyleEditorProps {
  value: DonationEditorValue;
  saving: boolean;
  onChange: (value: DonationEditorValue) => void;
  onSave: (value: DonationEditorValue) => Promise<void>;
}

export function DonationStyleEditor({
  value,
  saving,
  onChange,
  onSave,
}: DonationStyleEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [
    value.donationMessage,
    value.donationColor,
    value.donationMessageColor,
    value.donationMessageFont,
  ]);

  function patch(next: Partial<DonationEditorValue>) {
    const merged = { ...local, ...next };
    setLocal(merged);
    onChange(merged);
  }

  async function handleSave() {
    const buttons = normalizeHexColor(local.donationColor);
    const text = normalizeHexColor(local.donationMessageColor);
    if (!buttons || !text) {
      setError("Usá colores hexadecimales de 6 dígitos, por ejemplo #ec4899");
      return;
    }
    setError(null);
    await onSave({
      ...local,
      donationColor: buttons,
      donationMessageColor: text,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-5" />
          Texto de donación
        </CardTitle>
        <CardDescription>
          Mensaje, color y fuente de los botones de propina.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RichTextField
          id="donation-message"
          label="Texto de donación"
          value={local.donationMessage}
          onChange={(donationMessage) => patch({ donationMessage })}
          placeholder="Invitame un café"
          color={local.donationMessageColor}
          onColorChange={(donationMessageColor) =>
            patch({ donationMessageColor })
          }
          font={local.donationMessageFont}
          onFontChange={(donationMessageFont) =>
            patch({ donationMessageFont })
          }
        />

        <HexField
          id="donation-color"
          label="Color de los botones de propina"
          value={local.donationColor}
          fallback={DEFAULT_DONATION_COLOR}
          onChange={(donationColor) => patch({ donationColor })}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando…
            </>
          ) : (
            "Guardar donación"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { darkenHex, normalizeHexColor } from "@/lib/color";
import {
  DEFAULT_DONATION_COLOR,
  DEFAULT_DONATION_MESSAGE,
} from "@/hooks/use-site-settings";
import { formatArs } from "@/lib/money";
import { FormattedText } from "@/components/formatted-text";
import { fontFamilyCss, type SiteFontId } from "@/lib/site-fonts";

const AMOUNTS = [1000, 2000, 3000] as const;

interface DonationButtonsProps {
  imageId?: string;
  message?: string;
  color?: string;
  messageColor?: string;
  messageFont?: SiteFontId;
  previewOnly?: boolean;
}

export function DonationButtons({
  imageId,
  message = DEFAULT_DONATION_MESSAGE,
  color = DEFAULT_DONATION_COLOR,
  messageColor,
  messageFont,
  previewOnly = false,
}: DonationButtonsProps) {
  const [amount, setAmount] = useState<(typeof AMOUNTS)[number]>(1000);
  const [loading, setLoading] = useState(false);
  const accent = normalizeHexColor(color) ?? DEFAULT_DONATION_COLOR;
  const accentHover = darkenHex(accent);

  async function donate() {
    if (previewOnly || !imageId) return;
    setLoading(true);
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, imageId }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "No se pudo iniciar la donación");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast.error("No se pudo abrir Mercado Pago", { description: msg });
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
      <FormattedText
        as="p"
        text={message}
        color={messageColor}
        fontFamily={fontFamilyCss(messageFont)}
        className="text-sm font-medium"
      />
      <div className="flex w-full gap-2">
        {AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAmount(value)}
            className={cn(
              "flex-1 rounded-full border px-3 py-2.5 text-sm font-medium transition-colors",
              amount !== value &&
                "border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] dark:border-white/20 dark:bg-transparent dark:text-foreground dark:hover:bg-white/10",
            )}
            style={
              amount === value
                ? { backgroundColor: accent, borderColor: accent, color: "#fff" }
                : undefined
            }
          >
            {formatArs(value)}
          </button>
        ))}
      </div>
      <Button
        type="button"
        size="lg"
        className="mt-4 w-full text-white hover:opacity-95"
        style={{ backgroundColor: accent, borderColor: accent }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = accentHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = accent;
        }}
        onClick={donate}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Abriendo Mercado Pago…
          </>
        ) : (
          <>
            Donar {formatArs(amount)} con Mercado Pago
          </>
        )}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AMOUNTS = [1000, 2000, 3000] as const;

function formatPesos(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface DonationButtonsProps {
  imageId: string;
}

export function DonationButtons({ imageId }: DonationButtonsProps) {
  const [amount, setAmount] = useState<(typeof AMOUNTS)[number]>(1000);
  const [loading, setLoading] = useState(false);

  async function donate() {
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
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("No se pudo abrir Mercado Pago", { description: message });
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
      <p className="text-sm font-medium">Invitame un café</p>
      <div className="flex w-full gap-2">
        {AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAmount(value)}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              amount === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {formatPesos(value)}
          </button>
        ))}
      </div>
      <Button
        type="button"
        size="lg"
        className="w-full bg-[#009ee3] text-white hover:bg-[#008fd1]"
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
            <Heart className="size-4" />
            Donar {formatPesos(amount)} con Mercado Pago
          </>
        )}
      </Button>
    </div>
  );
}

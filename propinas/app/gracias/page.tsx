"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase/client";
import { DetailShell } from "@/components/detail-shell";
import { ThanksMessageView } from "@/components/thanks-message-view";
import { formatArs, parseDonationAmount } from "@/lib/money";
import { DEFAULT_SITE_STYLE, siteStyleFromRow, type SiteStyle } from "@/lib/site-style";

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GraciasContent />
    </Suspense>
  );
}

function GraciasContent() {
  const searchParams = useSearchParams();
  const amount = parseDonationAmount(searchParams.get("monto"));
  const imageId = searchParams.get("imageId");
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [thanksImageUrl, setThanksImageUrl] = useState<string | null>(null);
  const [siteStyle, setSiteStyle] = useState<SiteStyle>(DEFAULT_SITE_STYLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const sb = getSupabaseClient();
        const { data } = await sb
          .from("site_settings")
          .select("*")
          .eq("id", "main")
          .maybeSingle();
        if (data?.detail_background_url) {
          setBackgroundUrl(data.detail_background_url as string);
        }
        if (data?.thanks_image_url) {
          setThanksImageUrl(data.thanks_image_url as string);
        }
        setSiteStyle(siteStyleFromRow(data as Record<string, unknown> | null));
      } catch {
        // deja los textos por defecto
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const amountLabel = amount ? formatArs(amount) : "tu donación";

  return (
    <DetailShell backgroundUrl={backgroundUrl}>
      <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-full">
          {loading ? (
            <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
          ) : (
            <ThanksMessageView
              title={siteStyle.thanksTitle}
              body={siteStyle.thanksBody}
              message={siteStyle.thanksMessage}
              amountLabel={amountLabel}
              titleColor={siteStyle.thanksTitleColor}
              bodyColor={siteStyle.thanksBodyColor}
              messageColor={siteStyle.thanksMessageColor}
              titleFont={siteStyle.thanksTitleFont}
              bodyFont={siteStyle.thanksBodyFont}
              messageFont={siteStyle.thanksMessageFont}
              imageUrl={thanksImageUrl}
              cardEnabled={siteStyle.thanksCardEnabled}
            />
          )}
          <div className="mt-8 flex flex-col items-center gap-3">
            {imageId ? (
              <Link
                href={`/detalle/${imageId}`}
                className={cn(buttonVariants())}
              >
                Volver a la foto
              </Link>
            ) : (
              <Link href="/" className={cn(buttonVariants())}>
                Volver al inicio
              </Link>
            )}
          </div>
        </div>
      </div>
    </DetailShell>
  );
}

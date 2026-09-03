"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase/client";
import { downloadOriginalFile } from "@/lib/download-file";
import { toast } from "sonner";
import { ImagePreview } from "@/components/image-preview";
import { DonationButtons } from "@/components/donation-buttons";

interface ImageDetail {
  id: string;
  title: string;
  description: string;
  url: string;
  originalName: string;
}

export default function DetallePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <DetalleContent />
    </Suspense>
  );
}

function DetalleContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [image, setImage] = useState<ImageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const sb = getSupabaseClient();
        const { data, error } = await sb
          .from("images")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        setImage({
          id: data.id as string,
          title: (data.title as string) ?? "",
          description: (data.description as string) ?? "",
          url: data.url as string,
          originalName: (data.original_name as string) ?? "imagen",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  useEffect(() => {
    const status = searchParams.get("donacion");
    if (status === "ok") {
      toast.success("¡Gracias por tu donación!");
    } else if (status === "pending") {
      toast("Tu donación quedó pendiente");
    } else if (status === "error") {
      toast.error("La donación no se completó");
    }
  }, [searchParams]);

  const handleDownload = useCallback(async () => {
    if (!image) return;
    setDownloading(true);
    try {
      await downloadOriginalFile(image.url, image.originalName);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("No se pudo descargar", { description: message });
    } finally {
      setDownloading(false);
    }
  }, [image]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !image) {
    return (
      <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">Imagen no encontrada</h1>
        <Link href="/" className={cn(buttonVariants())}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }), "mb-6")}
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>

      <article className="space-y-6">
        <ImagePreview
          imageSrc={image.url}
          title={image.title}
          description={image.description}
        />

        <div className="flex flex-col items-center gap-6">
          <Button onClick={handleDownload} disabled={downloading} size="lg">
            {downloading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Preparando descarga…
              </>
            ) : (
              <>
                <Download className="size-4" />
                Descargar archivo original
              </>
            )}
          </Button>
          <DonationButtons imageId={image.id} />
        </div>
      </article>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Copy, Check, Trash2, Loader2, ImageIcon, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StorageImage } from "@/hooks/use-supabase-storage";
import { FormattedText } from "@/components/formatted-text";

interface ImageGalleryProps {
  images: StorageImage[];
  loading: boolean;
  onDelete: (image: StorageImage) => Promise<void>;
}

function CopyLinkButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const url = `${window.location.origin}/detalle/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  return (
    <Button variant="outline" size="sm" onClick={copy} className="flex-1">
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copiar link
        </>
      )}
    </Button>
  );
}

export function ImageGallery({ images, loading, onDelete }: ImageGalleryProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (image: StorageImage) => {
      setDeleting(image.id);
      try {
        await onDelete(image);
      } finally {
        setDeleting(null);
      }
    },
    [onDelete],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-5" />
          Imágenes subidas
        </CardTitle>
        <CardDescription>
          El link abre la vista de detalle con título, foto y descarga.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <ImageIcon className="size-10" />
            <p className="text-sm">Aún no hay imágenes subidas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group overflow-hidden rounded-lg border bg-muted/30"
              >
                <Link href={`/detalle/${img.id}`} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title || img.originalName}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="space-y-2 p-3">
                  <FormattedText
                    text={img.title || img.originalName}
                    className="truncate text-sm font-medium"
                  />

                  <div className="flex gap-2">
                    <CopyLinkButton id={img.id} />
                    <Link
                      href={`/detalle/${img.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(img)}
                      disabled={deleting === img.id}
                    >
                      {deleting === img.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

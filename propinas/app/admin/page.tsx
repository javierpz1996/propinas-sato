"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { ImageGallery } from "@/components/admin/image-gallery";
import { AdminGate } from "@/components/admin/admin-gate";
import { useSupabaseStorage } from "@/hooks/use-supabase-storage";
import type { StorageImage, UploadPayload } from "@/hooks/use-supabase-storage";
import { isAdminUnlocked, lockAdmin } from "@/lib/admin-auth";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const { images, uploading, loading, uploadImage, deleteImage } =
    useSupabaseStorage(unlocked);

  useEffect(() => {
    setUnlocked(isAdminUnlocked());
  }, []);

  const handleUpload = useCallback(
    async (payload: UploadPayload) => {
      try {
        const img = await uploadImage(payload);
        const link = `${window.location.origin}/detalle/${img.id}`;
        toast.success("Imagen subida correctamente", {
          description: link,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        toast.error("Error al subir la imagen", { description: message });
      }
    },
    [uploadImage],
  );

  const handleDelete = useCallback(
    async (image: StorageImage) => {
      try {
        await deleteImage(image);
        toast.success("Imagen eliminada");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        toast.error("Error al eliminar", { description: message });
      }
    },
    [deleteImage],
  );

  if (!unlocked) {
    return <AdminGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Administra las imágenes y el contenido de tu sitio.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Home
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              lockAdmin();
              setUnlocked(false);
            }}
          >
            <LogOut className="size-4" />
            Salir
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <ImageDropzone onUpload={handleUpload} uploading={uploading} />

      <Separator className="my-8" />

      <ImageGallery
        images={images}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}

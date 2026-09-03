"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { ImageGallery } from "@/components/admin/image-gallery";
import { BackgroundPickerButton } from "@/components/admin/background-picker-button";
import { DetailPreviewCard } from "@/components/admin/detail-preview-card";
import { DonationPreviewCard } from "@/components/admin/donation-preview-card";
import { DonationStyleEditor } from "@/components/admin/donation-style-editor";
import { ThanksStyleEditor } from "@/components/admin/thanks-style-editor";
import { ThanksPreviewCard } from "@/components/admin/thanks-preview-card";
import { AdminGate } from "@/components/admin/admin-gate";
import { useSupabaseStorage } from "@/hooks/use-supabase-storage";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { DEFAULT_SITE_STYLE, type SiteStyle } from "@/lib/site-style";
import type { StorageImage, UploadPayload } from "@/hooks/use-supabase-storage";
import { isAdminUnlocked } from "@/lib/admin-auth";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pendingThanksImage, setPendingThanksImage] = useState<File | null>(null);
  const [pendingThanksImageUrl, setPendingThanksImageUrl] = useState<string | null>(
    null,
  );
  const [pendingBackground, setPendingBackground] = useState<File | null>(null);
  const [pendingBackgroundUrl, setPendingBackgroundUrl] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState({
    previewUrl: null as string | null,
    title: "",
    description: "",
  });
  const [styleDraft, setStyleDraft] = useState<SiteStyle>(DEFAULT_SITE_STYLE);
  const { images, uploading, loading, uploadImage, deleteImage } =
    useSupabaseStorage(unlocked);
  const {
    backgroundUrl,
    thanksImageUrl,
    style,
    saving: savingBackground,
    saveBackground,
    clearBackground,
    saveThanksImage,
    clearThanksImage,
    saveSiteStyle,
  } = useSiteSettings(unlocked);

  useEffect(() => {
    setUnlocked(isAdminUnlocked());
  }, []);

  useEffect(() => {
    setStyleDraft(style);
  }, [style]);

  const persistStyle = useCallback(
    async (next: SiteStyle) => {
      await saveSiteStyle(next);
      setStyleDraft(next);
    },
    [saveSiteStyle],
  );

  const handleUpload = useCallback(
    async (payload: UploadPayload) => {
      try {
        const img = await uploadImage(payload);
        const link = `${window.location.origin}/detalle/${img.id}`;
        toast.success("Imagen subida correctamente", {
          description: link,
        });
        setDraft({ previewUrl: null, title: "", description: "" });
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
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Administra las imágenes y el contenido de tu sitio.
          </p>
        </div>
        <div className="flex flex-wrap items-start justify-end gap-2">
          <BackgroundPickerButton
            saving={savingBackground}
            onPick={(file) => {
              if (pendingBackgroundUrl) URL.revokeObjectURL(pendingBackgroundUrl);
              setPendingBackground(file);
              setPendingBackgroundUrl(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ImageDropzone
          onUpload={handleUpload}
          uploading={uploading}
          onDraftChange={setDraft}
          titleColor={styleDraft.titleColor}
          descriptionColor={styleDraft.descriptionColor}
          titleFont={styleDraft.titleFont}
          descriptionFont={styleDraft.descriptionFont}
          onTitleColorChange={(color) =>
            setStyleDraft((prev) => ({ ...prev, titleColor: color }))
          }
          onDescriptionColorChange={(color) =>
            setStyleDraft((prev) => ({ ...prev, descriptionColor: color }))
          }
          onTitleFontChange={(font) =>
            setStyleDraft((prev) => ({ ...prev, titleFont: font }))
          }
          onDescriptionFontChange={(font) =>
            setStyleDraft((prev) => ({ ...prev, descriptionFont: font }))
          }
          savingStyle={savingBackground}
          onSaveStyle={async () => {
            try {
              await persistStyle(styleDraft);
              toast.success("Colores y fuentes del post guardados");
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Error desconocido";
              toast.error("No se pudo guardar", { description: message });
            }
          }}
        />
        <DetailPreviewCard
          backgroundUrl={pendingBackgroundUrl || backgroundUrl}
          imageSrc={draft.previewUrl}
          title={draft.title}
          description={draft.description}
          titleColor={styleDraft.titleColor}
          descriptionColor={styleDraft.descriptionColor}
          titleFont={styleDraft.titleFont}
          descriptionFont={styleDraft.descriptionFont}
          pendingFile={Boolean(pendingBackground)}
          saving={savingBackground}
          canClear={Boolean(backgroundUrl)}
          onApply={async () => {
            if (!pendingBackground) return;
            try {
              await saveBackground(pendingBackground);
              if (pendingBackgroundUrl) URL.revokeObjectURL(pendingBackgroundUrl);
              setPendingBackground(null);
              setPendingBackgroundUrl(null);
              toast.success("Fondo actualizado");
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Error desconocido";
              toast.error("No se pudo guardar el fondo", {
                description: message,
              });
            }
          }}
          onClear={async () => {
            try {
              await clearBackground();
              toast.success("Fondo quitado");
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Error desconocido";
              toast.error("No se pudo quitar el fondo", {
                description: message,
              });
            }
          }}
        />
      </div>

      <Separator className="my-8" />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <DonationStyleEditor
          value={{
            donationMessage: styleDraft.donationMessage,
            donationColor: styleDraft.donationColor,
            donationMessageColor: styleDraft.donationMessageColor,
            donationMessageFont: styleDraft.donationMessageFont,
          }}
          saving={savingBackground}
          onChange={(donation) =>
            setStyleDraft((prev) => ({ ...prev, ...donation }))
          }
          onSave={async (donation) => {
            try {
              await persistStyle({ ...styleDraft, ...donation });
              toast.success("Texto de donación guardado");
            } catch (err) {
              const msg =
                err instanceof Error ? err.message : "Error desconocido";
              toast.error("No se pudo guardar", { description: msg });
            }
          }}
        />
        <DonationPreviewCard
          backgroundUrl={pendingBackgroundUrl || backgroundUrl}
          message={styleDraft.donationMessage}
          color={styleDraft.donationColor}
          messageColor={styleDraft.donationMessageColor}
          messageFont={styleDraft.donationMessageFont}
        />
      </div>

      <Separator className="my-8" />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ThanksStyleEditor
          value={{
            thanksTitle: styleDraft.thanksTitle,
            thanksBody: styleDraft.thanksBody,
            thanksMessage: styleDraft.thanksMessage,
            thanksTitleColor: styleDraft.thanksTitleColor,
            thanksBodyColor: styleDraft.thanksBodyColor,
            thanksMessageColor: styleDraft.thanksMessageColor,
            thanksTitleFont: styleDraft.thanksTitleFont,
            thanksBodyFont: styleDraft.thanksBodyFont,
            thanksMessageFont: styleDraft.thanksMessageFont,
            thanksCardEnabled: styleDraft.thanksCardEnabled,
          }}
          imageUrl={pendingThanksImageUrl || thanksImageUrl}
          saving={savingBackground}
          onChange={(thanks) =>
            setStyleDraft((prev) => ({ ...prev, ...thanks }))
          }
          onPickImage={(file) => {
            if (pendingThanksImageUrl) URL.revokeObjectURL(pendingThanksImageUrl);
            setPendingThanksImage(file);
            setPendingThanksImageUrl(URL.createObjectURL(file));
          }}
          onClearImage={async () => {
            if (pendingThanksImageUrl) {
              URL.revokeObjectURL(pendingThanksImageUrl);
              setPendingThanksImage(null);
              setPendingThanksImageUrl(null);
              return;
            }
            try {
              await clearThanksImage();
              toast.success("Imagen de gracias quitada");
            } catch (err) {
              const msg =
                err instanceof Error ? err.message : "Error desconocido";
              toast.error("No se pudo quitar la imagen", { description: msg });
            }
          }}
          onSave={async (thanks) => {
            try {
              if (pendingThanksImage) {
                await saveThanksImage(pendingThanksImage);
                if (pendingThanksImageUrl) {
                  URL.revokeObjectURL(pendingThanksImageUrl);
                }
                setPendingThanksImage(null);
                setPendingThanksImageUrl(null);
              }
              await persistStyle({ ...styleDraft, ...thanks });
              toast.success("Texto de gracias guardado");
            } catch (err) {
              const msg =
                err instanceof Error ? err.message : "Error desconocido";
              toast.error("No se pudo guardar", { description: msg });
            }
          }}
        />
        <ThanksPreviewCard
          backgroundUrl={pendingBackgroundUrl || backgroundUrl}
          title={styleDraft.thanksTitle}
          body={styleDraft.thanksBody}
          message={styleDraft.thanksMessage}
          titleColor={styleDraft.thanksTitleColor}
          bodyColor={styleDraft.thanksBodyColor}
          messageColor={styleDraft.thanksMessageColor}
          titleFont={styleDraft.thanksTitleFont}
          bodyFont={styleDraft.thanksBodyFont}
          messageFont={styleDraft.thanksMessageFont}
          imageUrl={pendingThanksImageUrl || thanksImageUrl}
          cardEnabled={styleDraft.thanksCardEnabled}
        />
      </div>

      <Separator className="my-8" />

      <ImageGallery
        images={images}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}

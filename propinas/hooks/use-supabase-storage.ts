"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

const BUCKET = "uploads";
const FOLDER = "uploads";

export interface StorageImage {
  id: string;
  title: string;
  description: string;
  name: string;
  filePath: string;
  url: string;
  originalName: string;
  createdAt: string;
}

export interface UploadPayload {
  file: File;
  title: string;
  description: string;
}

export function useSupabaseStorage(enabled = true) {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const sb = getSupabaseClient();
      const { data, error } = await sb
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const items: StorageImage[] = (data ?? []).map((row) => ({
        id: row.id as string,
        title: (row.title as string) ?? "",
        description: (row.description as string) ?? "",
        name: (row.file_path as string).split("/").pop() ?? "",
        filePath: row.file_path as string,
        url: row.url as string,
        originalName: (row.original_name as string) ?? "",
        createdAt: (row.created_at as string) ?? "",
      }));

      setImages(items);
    } catch (err) {
      console.error("Error al obtener imágenes:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async ({ file, title, description }: UploadPayload) => {
    setUploading(true);
    try {
      const sb = getSupabaseClient();
      const ext = file.name.split(".").pop() ?? "png";
      const uniqueName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `${FOLDER}/${uniqueName}`;

      const { error: storageError } = await sb.storage
        .from(BUCKET)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (storageError) throw storageError;

      const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(filePath);

      const { data: row, error: dbError } = await sb
        .from("images")
        .insert({
          title: title.trim(),
          description: description.trim(),
          file_path: filePath,
          url: urlData.publicUrl,
          original_name: file.name,
        })
        .select("*")
        .single();

      if (dbError) throw dbError;

      const newImage: StorageImage = {
        id: row.id as string,
        title: (row.title as string) ?? "",
        description: (row.description as string) ?? "",
        name: uniqueName,
        filePath,
        url: urlData.publicUrl,
        originalName: file.name,
        createdAt: (row.created_at as string) ?? new Date().toISOString(),
      };

      setImages((prev) => [newImage, ...prev]);
      return newImage;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteImage = useCallback(async (image: StorageImage) => {
    const sb = getSupabaseClient();

    const { error: storageError } = await sb.storage
      .from(BUCKET)
      .remove([image.filePath]);
    if (storageError) throw storageError;

    const { error: dbError } = await sb.from("images").delete().eq("id", image.id);
    if (dbError) throw dbError;

    setImages((prev) => prev.filter((img) => img.id !== image.id));
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchImages().catch(() => {
      setLoading(false);
    });
  }, [enabled, fetchImages]);

  return { images, uploading, loading, uploadImage, deleteImage, fetchImages };
}

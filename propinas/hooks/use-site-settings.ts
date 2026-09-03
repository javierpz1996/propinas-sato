"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  DEFAULT_SITE_STYLE,
  siteStyleFromRow,
  siteStyleToRow,
  type SiteStyle,
} from "@/lib/site-style";

export {
  DEFAULT_DONATION_COLOR,
  DEFAULT_DONATION_MESSAGE,
  DEFAULT_DONATION_MESSAGE_COLOR,
  DEFAULT_DESCRIPTION_COLOR,
  DEFAULT_TITLE_COLOR,
} from "@/hooks/use-site-settings-defaults";

const BUCKET = "uploads";
const FOLDER = "backgrounds";
const THANKS_FOLDER = "thanks";
const SETTINGS_ID = "main";

export function useSiteSettings(enabled = true) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [backgroundPath, setBackgroundPath] = useState<string | null>(null);
  const [thanksImageUrl, setThanksImageUrl] = useState<string | null>(null);
  const [thanksImagePath, setThanksImagePath] = useState<string | null>(null);
  const [style, setStyle] = useState<SiteStyle>(DEFAULT_SITE_STYLE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const sb = getSupabaseClient();
      const { data, error } = await sb
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

      if (error) throw error;

      setBackgroundUrl((data?.detail_background_url as string | null) ?? null);
      setBackgroundPath((data?.detail_background_path as string | null) ?? null);
      setThanksImageUrl((data?.thanks_image_url as string | null) ?? null);
      setThanksImagePath((data?.thanks_image_path as string | null) ?? null);
      setStyle(siteStyleFromRow((data as Record<string, unknown> | null) ?? null));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBackground = useCallback(
    async (file: File) => {
      setSaving(true);
      try {
        const sb = getSupabaseClient();
        const ext = file.name.split(".").pop() ?? "jpg";
        const filePath = `${FOLDER}/detalle-${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await sb.storage
          .from(BUCKET)
          .upload(filePath, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(filePath);

        if (backgroundPath) {
          await sb.storage.from(BUCKET).remove([backgroundPath]);
        }

        const { error: upsertError } = await sb
          .from("site_settings")
          .update({
            detail_background_url: urlData.publicUrl,
            detail_background_path: filePath,
          })
          .eq("id", SETTINGS_ID);
        if (upsertError) throw upsertError;

        setBackgroundUrl(urlData.publicUrl);
        setBackgroundPath(filePath);
        return urlData.publicUrl;
      } finally {
        setSaving(false);
      }
    },
    [backgroundPath],
  );

  const clearBackground = useCallback(async () => {
    setSaving(true);
    try {
      const sb = getSupabaseClient();
      if (backgroundPath) {
        await sb.storage.from(BUCKET).remove([backgroundPath]);
      }
      const { error } = await sb
        .from("site_settings")
        .update({
          detail_background_url: null,
          detail_background_path: null,
        })
        .eq("id", SETTINGS_ID);
      if (error) throw error;
      setBackgroundUrl(null);
      setBackgroundPath(null);
    } finally {
      setSaving(false);
    }
  }, [backgroundPath]);

  const saveThanksImage = useCallback(
    async (file: File) => {
      setSaving(true);
      try {
        const sb = getSupabaseClient();
        const ext = file.name.split(".").pop() ?? "jpg";
        const filePath = `${THANKS_FOLDER}/gracias-${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await sb.storage
          .from(BUCKET)
          .upload(filePath, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(filePath);

        if (thanksImagePath) {
          await sb.storage.from(BUCKET).remove([thanksImagePath]);
        }

        const { error: updateError } = await sb
          .from("site_settings")
          .update({
            thanks_image_url: urlData.publicUrl,
            thanks_image_path: filePath,
          })
          .eq("id", SETTINGS_ID);
        if (updateError) throw updateError;

        setThanksImageUrl(urlData.publicUrl);
        setThanksImagePath(filePath);
        return urlData.publicUrl;
      } finally {
        setSaving(false);
      }
    },
    [thanksImagePath],
  );

  const clearThanksImage = useCallback(async () => {
    setSaving(true);
    try {
      const sb = getSupabaseClient();
      if (thanksImagePath) {
        await sb.storage.from(BUCKET).remove([thanksImagePath]);
      }
      const { error } = await sb
        .from("site_settings")
        .update({
          thanks_image_url: null,
          thanks_image_path: null,
        })
        .eq("id", SETTINGS_ID);
      if (error) throw error;
      setThanksImageUrl(null);
      setThanksImagePath(null);
    } finally {
      setSaving(false);
    }
  }, [thanksImagePath]);

  const saveSiteStyle = useCallback(async (next: SiteStyle) => {
    setSaving(true);
    try {
      const sb = getSupabaseClient();
      const row = siteStyleToRow(next);
      const { data, error } = await sb
        .from("site_settings")
        .update(row)
        .eq("id", SETTINGS_ID)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        const { error: insertError } = await sb.from("site_settings").insert({
          id: SETTINGS_ID,
          ...row,
        });
        if (insertError) throw insertError;
      }
      setStyle(next);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchSettings().catch(() => setLoading(false));
  }, [enabled, fetchSettings]);

  return {
    backgroundUrl,
    thanksImageUrl,
    style,
    loading,
    saving,
    saveBackground,
    clearBackground,
    saveThanksImage,
    clearThanksImage,
    saveSiteStyle,
  };
}

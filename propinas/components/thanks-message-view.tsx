"use client";

import { FormattedText } from "@/components/formatted-text";
import { applyThanksPlaceholders } from "@/lib/thanks-message";
import { fontFamilyCss, type SiteFontId } from "@/lib/site-fonts";
import { cn } from "@/lib/utils";

interface ThanksMessageViewProps {
  title: string;
  body: string;
  message: string;
  amountLabel: string;
  titleColor?: string;
  bodyColor?: string;
  messageColor?: string;
  titleFont?: SiteFontId;
  bodyFont?: SiteFontId;
  messageFont?: SiteFontId;
  imageUrl?: string | null;
  cardEnabled?: boolean;
}

export function ThanksMessageView({
  title,
  body,
  message,
  amountLabel,
  titleColor,
  bodyColor,
  messageColor,
  titleFont,
  bodyFont,
  messageFont,
  imageUrl,
  cardEnabled = true,
}: ThanksMessageViewProps) {
  return (
    <div
      className={cn(
        "text-center",
        cardEnabled
          ? "rounded-2xl bg-white/90 px-6 py-10 shadow-sm backdrop-blur-sm dark:bg-black/50"
          : "px-2 py-4",
      )}
    >
      <p className="text-4xl" aria-hidden>
        🎉
      </p>
      <FormattedText
        as="h1"
        text={applyThanksPlaceholders(title, amountLabel)}
        color={titleColor}
        fontFamily={fontFamilyCss(titleFont)}
        className="mt-4 text-2xl font-semibold tracking-tight"
      />
      <FormattedText
        as="p"
        text={applyThanksPlaceholders(body, amountLabel)}
        color={bodyColor}
        fontFamily={fontFamilyCss(bodyFont)}
        className="mt-3"
      />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="mx-auto mt-5 max-h-56 w-full max-w-sm object-contain"
        />
      ) : null}
      <FormattedText
        as="p"
        text={applyThanksPlaceholders(message, amountLabel)}
        color={messageColor}
        fontFamily={fontFamilyCss(messageFont)}
        className="mt-4 font-medium"
      />
    </div>
  );
}

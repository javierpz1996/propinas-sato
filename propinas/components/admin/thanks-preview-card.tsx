"use client";

import { DetailShell } from "@/components/detail-shell";
import { ThanksMessageView } from "@/components/thanks-message-view";
import { formatArs } from "@/lib/money";
import type { SiteFontId } from "@/lib/site-fonts";

interface ThanksPreviewCardProps {
  backgroundUrl: string | null;
  title: string;
  body: string;
  message: string;
  titleColor?: string;
  bodyColor?: string;
  messageColor?: string;
  titleFont?: SiteFontId;
  bodyFont?: SiteFontId;
  messageFont?: SiteFontId;
  imageUrl?: string | null;
  cardEnabled?: boolean;
}

export function ThanksPreviewCard({
  backgroundUrl,
  title,
  body,
  message,
  titleColor,
  bodyColor,
  messageColor,
  titleFont,
  bodyFont,
  messageFont,
  imageUrl,
  cardEnabled,
}: ThanksPreviewCardProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium">
        Vista previa de gracias
      </p>
      <DetailShell backgroundUrl={backgroundUrl} compact>
        <ThanksMessageView
          title={title}
          body={body}
          message={message}
          amountLabel={formatArs(1000)}
          titleColor={titleColor}
          bodyColor={bodyColor}
          messageColor={messageColor}
          titleFont={titleFont}
          bodyFont={bodyFont}
          messageFont={messageFont}
          imageUrl={imageUrl}
          cardEnabled={cardEnabled}
        />
      </DetailShell>
    </div>
  );
}

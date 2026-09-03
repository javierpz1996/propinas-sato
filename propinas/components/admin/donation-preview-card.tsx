"use client";

import { DetailShell } from "@/components/detail-shell";
import { DonationButtons } from "@/components/donation-buttons";
import type { SiteFontId } from "@/lib/site-fonts";

interface DonationPreviewCardProps {
  backgroundUrl: string | null;
  message: string;
  color: string;
  messageColor: string;
  messageFont?: SiteFontId;
}

export function DonationPreviewCard({
  backgroundUrl,
  message,
  color,
  messageColor,
  messageFont,
}: DonationPreviewCardProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium">
        Vista previa de la donación
      </p>
      <DetailShell backgroundUrl={backgroundUrl} compact>
        <DonationButtons
          previewOnly
          message={message || "Invitame un café"}
          color={color}
          messageColor={messageColor}
          messageFont={messageFont}
        />
      </DetailShell>
    </div>
  );
}

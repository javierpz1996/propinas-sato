import {
  DEFAULT_DONATION_COLOR,
  DEFAULT_DONATION_MESSAGE,
  DEFAULT_DONATION_MESSAGE_COLOR,
  DEFAULT_DESCRIPTION_COLOR,
  DEFAULT_TITLE_COLOR,
} from "@/hooks/use-site-settings-defaults";
import {
  DEFAULT_THANKS_BODY,
  DEFAULT_THANKS_MESSAGE,
  DEFAULT_THANKS_TITLE,
} from "@/lib/thanks-message";
import { normalizeSiteFont, type SiteFontId } from "@/lib/site-fonts";
import { normalizeHexColor } from "@/lib/color";

export type SiteStyle = {
  donationMessage: string;
  donationColor: string;
  donationMessageColor: string;
  donationMessageFont: SiteFontId;
  titleColor: string;
  descriptionColor: string;
  titleFont: SiteFontId;
  descriptionFont: SiteFontId;
  thanksTitle: string;
  thanksBody: string;
  thanksMessage: string;
  thanksTitleColor: string;
  thanksBodyColor: string;
  thanksMessageColor: string;
  thanksTitleFont: SiteFontId;
  thanksBodyFont: SiteFontId;
  thanksMessageFont: SiteFontId;
  thanksCardEnabled: boolean;
};

export const DEFAULT_SITE_STYLE: SiteStyle = {
  donationMessage: DEFAULT_DONATION_MESSAGE,
  donationColor: DEFAULT_DONATION_COLOR,
  donationMessageColor: DEFAULT_DONATION_MESSAGE_COLOR,
  donationMessageFont: "sans",
  titleColor: DEFAULT_TITLE_COLOR,
  descriptionColor: DEFAULT_DESCRIPTION_COLOR,
  titleFont: "sans",
  descriptionFont: "sans",
  thanksTitle: DEFAULT_THANKS_TITLE,
  thanksBody: DEFAULT_THANKS_BODY,
  thanksMessage: DEFAULT_THANKS_MESSAGE,
  thanksTitleColor: DEFAULT_TITLE_COLOR,
  thanksBodyColor: DEFAULT_DESCRIPTION_COLOR,
  thanksMessageColor: DEFAULT_TITLE_COLOR,
  thanksTitleFont: "sans",
  thanksBodyFont: "sans",
  thanksMessageFont: "sans",
  thanksCardEnabled: true,
};

function hexOr(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return normalizeHexColor(value) ?? fallback;
}

function boolOr(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return fallback;
}

function textOr(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return value.trim() ? value : fallback;
}

export function siteStyleFromRow(data: Record<string, unknown> | null): SiteStyle {
  return {
    donationMessage: textOr(data?.donation_message, DEFAULT_SITE_STYLE.donationMessage),
    donationColor: hexOr(data?.donation_color, DEFAULT_SITE_STYLE.donationColor),
    donationMessageColor: hexOr(
      data?.donation_message_color,
      DEFAULT_SITE_STYLE.donationMessageColor,
    ),
    donationMessageFont: normalizeSiteFont(data?.donation_message_font as string),
    titleColor: hexOr(data?.title_color, DEFAULT_SITE_STYLE.titleColor),
    descriptionColor: hexOr(
      data?.description_color,
      DEFAULT_SITE_STYLE.descriptionColor,
    ),
    titleFont: normalizeSiteFont(data?.title_font as string),
    descriptionFont: normalizeSiteFont(data?.description_font as string),
    thanksTitle: textOr(data?.thanks_title, DEFAULT_SITE_STYLE.thanksTitle),
    thanksBody: textOr(data?.thanks_body, DEFAULT_SITE_STYLE.thanksBody),
    thanksMessage: textOr(data?.thanks_message, DEFAULT_SITE_STYLE.thanksMessage),
    thanksTitleColor: hexOr(
      data?.thanks_title_color,
      DEFAULT_SITE_STYLE.thanksTitleColor,
    ),
    thanksBodyColor: hexOr(
      data?.thanks_body_color,
      DEFAULT_SITE_STYLE.thanksBodyColor,
    ),
    thanksMessageColor: hexOr(
      data?.thanks_message_color,
      DEFAULT_SITE_STYLE.thanksMessageColor,
    ),
    thanksTitleFont: normalizeSiteFont(data?.thanks_title_font as string),
    thanksBodyFont: normalizeSiteFont(data?.thanks_body_font as string),
    thanksMessageFont: normalizeSiteFont(data?.thanks_message_font as string),
    thanksCardEnabled: boolOr(data?.thanks_card_enabled, true),
  };
}

export function siteStyleToRow(style: SiteStyle) {
  return {
    donation_message: style.donationMessage.trim() || DEFAULT_SITE_STYLE.donationMessage,
    donation_color: style.donationColor,
    donation_message_color: style.donationMessageColor,
    donation_message_font: style.donationMessageFont,
    title_color: style.titleColor,
    description_color: style.descriptionColor,
    title_font: style.titleFont,
    description_font: style.descriptionFont,
    thanks_title: style.thanksTitle.trim() || DEFAULT_SITE_STYLE.thanksTitle,
    thanks_body: style.thanksBody.trim() || DEFAULT_SITE_STYLE.thanksBody,
    thanks_message: style.thanksMessage.trim() || DEFAULT_SITE_STYLE.thanksMessage,
    thanks_title_color: style.thanksTitleColor,
    thanks_body_color: style.thanksBodyColor,
    thanks_message_color: style.thanksMessageColor,
    thanks_title_font: style.thanksTitleFont,
    thanks_body_font: style.thanksBodyFont,
    thanks_message_font: style.thanksMessageFont,
    thanks_card_enabled: style.thanksCardEnabled,
  };
}

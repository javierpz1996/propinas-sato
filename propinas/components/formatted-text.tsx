import { formatRichText } from "@/lib/format-text";
import { cn } from "@/lib/utils";

interface FormattedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "p" | "div";
  color?: string;
  fontFamily?: string;
}

export function FormattedText({
  text,
  className,
  as: Tag = "div",
  color,
  fontFamily,
}: FormattedTextProps) {
  if (!text) return null;

  return (
    <Tag
      className={cn("whitespace-pre-wrap break-words", className)}
      style={{
        ...(color ? { color } : {}),
        ...(fontFamily ? { fontFamily } : {}),
      }}
      dangerouslySetInnerHTML={{ __html: formatRichText(text) }}
    />
  );
}

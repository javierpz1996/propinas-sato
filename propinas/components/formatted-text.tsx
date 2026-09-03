import { formatRichText } from "@/lib/format-text";
import { cn } from "@/lib/utils";

interface FormattedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "p" | "div";
}

export function FormattedText({
  text,
  className,
  as: Tag = "div",
}: FormattedTextProps) {
  if (!text) return null;

  return (
    <Tag
      className={cn("whitespace-pre-wrap break-words", className)}
      dangerouslySetInnerHTML={{ __html: formatRichText(text) }}
    />
  );
}

"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Underline, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_FONTS, type SiteFontId } from "@/lib/site-fonts";
import { cn } from "@/lib/utils";

const EMOJIS = [
  "😀", "😂", "😍", "🥳", "😎", "🤩", "😢", "😡",
  "👍", "👎", "👏", "🙌", "🔥", "✨", "💯", "❤️",
  "💙", "💚", "💛", "💜", "⭐", "🎉", "📸", "🖼️",
];

interface RichTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  color?: string;
  onColorChange?: (color: string) => void;
  font?: SiteFontId;
  onFontChange?: (font: SiteFontId) => void;
}

function wrapSelection(
  element: HTMLInputElement | HTMLTextAreaElement,
  before: string,
  after: string,
  onChange: (value: string) => void,
) {
  const start = element.selectionStart ?? 0;
  const end = element.selectionEnd ?? 0;
  const selected = element.value.slice(start, end) || "texto";
  const next =
    element.value.slice(0, start) + before + selected + after + element.value.slice(end);

  onChange(next);

  requestAnimationFrame(() => {
    element.focus();
    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selected.length;
    element.setSelectionRange(cursorStart, cursorEnd);
  });
}

function insertAtCursor(
  element: HTMLInputElement | HTMLTextAreaElement,
  insert: string,
  onChange: (value: string) => void,
) {
  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? start;
  const next = element.value.slice(0, start) + insert + element.value.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    element.focus();
    const pos = start + insert.length;
    element.setSelectionRange(pos, pos);
  });
}

export function RichTextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  multiline = false,
  rows = 4,
  color,
  onColorChange,
  font,
  onFontChange,
}: RichTextFieldProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const fieldClassName = cn(
    "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={disabled}
          title="Negrita"
          onClick={() => {
            if (inputRef.current) wrapSelection(inputRef.current, "**", "**", onChange);
          }}
        >
          <Bold />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={disabled}
          title="Cursiva"
          onClick={() => {
            if (inputRef.current) wrapSelection(inputRef.current, "*", "*", onChange);
          }}
        >
          <Italic />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={disabled}
          title="Subrayado"
          onClick={() => {
            if (inputRef.current) wrapSelection(inputRef.current, "__", "__", onChange);
          }}
        >
          <Underline />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={disabled}
          title="Emojis"
          onClick={() => setShowEmojis((open) => !open)}
        >
          <Smile />
        </Button>
        {onColorChange ? (
          <label
            className="relative inline-flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#dadce0] bg-white"
            title="Color del texto"
          >
            <span
              className="size-4 rounded-full border border-black/10"
              style={{ backgroundColor: color || "#171717" }}
            />
            <input
              type="color"
              value={/^#[0-9A-Fa-f]{6}$/.test(color ?? "") ? color! : "#171717"}
              disabled={disabled}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        ) : null}
        {onFontChange ? (
          <select
            value={font || "sans"}
            disabled={disabled}
            title="Fuente"
            onChange={(e) => onFontChange(e.target.value as SiteFontId)}
            className="h-7 rounded-full border border-[#dadce0] bg-white px-2 text-xs dark:border-white/20 dark:bg-transparent"
          >
            {SITE_FONTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {showEmojis && (
        <div className="grid grid-cols-8 gap-1 rounded-lg border bg-muted/40 p-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="rounded-md p-1 text-lg hover:bg-muted"
              onClick={() => {
                if (inputRef.current) insertAtCursor(inputRef.current, emoji, onChange);
                setShowEmojis(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {multiline ? (
        <textarea
          id={id}
          ref={(el) => {
            inputRef.current = el;
          }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={rows}
          className={fieldClassName}
        />
      ) : (
        <input
          id={id}
          ref={(el) => {
            inputRef.current = el;
          }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(fieldClassName, "h-9")}
        />
      )}
    </div>
  );
}

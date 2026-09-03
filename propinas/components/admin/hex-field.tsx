"use client";

import { Input } from "@/components/ui/input";
import { normalizeHexColor } from "@/lib/color";

export function HexField({
  id,
  label,
  value,
  fallback,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={normalizeHexColor(value) ?? fallback}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 cursor-pointer rounded-md border bg-transparent p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fallback}
          className="max-w-[160px] font-mono uppercase"
        />
      </div>
    </div>
  );
}

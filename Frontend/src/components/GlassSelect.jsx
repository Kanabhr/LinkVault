import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * GlassSelect — a fully custom dropdown matching the app's glass design system.
 *
 * Props:
 *   value       {string}              — currently selected value
 *   onChange    {(val: string) => void} — called with new value on selection
 *   options     {string[] | {value: string, label: string}[]} — option list
 *   aria-label  {string}              — accessible label
 *   style       {object}              — optional outer wrapper style overrides
 *   height      {number}              — trigger button height (default 40)
 *   fontSize    {number}              — font size (default 13)
 *   icon        {ReactNode}           — optional leading icon inside trigger
 */
export default function GlassSelect({
  value,
  onChange,
  options = [],
  "aria-label": ariaLabel,
  style: outerStyle = {},
  height = 40,
  fontSize = 13,
  icon,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Normalise options to {value, label} shape
  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );

  const selected = normalised.find((o) => o.value === value) ?? normalised[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", flexShrink: 0, ...outerStyle }}
    >
      {/* ── Trigger button ───────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height,
          padding: icon ? "0 10px 0 8px" : "0 10px",
          borderRadius: "var(--r-md)",
          border: `1px solid ${open ? "var(--accent)" : "var(--glass-border)"}`,
          background: open ? "var(--glass-bg-default)" : "var(--glass-bg-subtle)",
          backdropFilter: "blur(12px) saturate(160%)",
          WebkitBackdropFilter: "blur(12px) saturate(160%)",
          boxShadow: open
            ? "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 0 0 3px rgb(255 49 98 / 0.16)"
            : "inset 0 1px 0 rgb(255 255 255 / 0.06), 0 2px 6px rgb(0 0 0 / 0.20)",
          color: "var(--text-primary)",
          fontSize,
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition:
            "border-color 180ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1), background 280ms cubic-bezier(0.22,1,0.36,1)",
          minWidth: 110,
          width: "100%",
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center", color: open ? "var(--accent)" : "var(--text-muted)", flexShrink: 0, transition: "color 180ms ease" }}>
            {icon}
          </span>
        )}
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected?.label ?? value}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          style={{
            flexShrink: 0,
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </button>

      {/* ── Dropdown panel ───────────────────────────────────────────── */}
      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: "100%",
            zIndex: 200,
            borderRadius: "var(--r-md)",
            border: "1px solid var(--glass-border-hi)",
            background: "rgb(18 18 24 / 0.92)",
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)",
            boxShadow:
              "inset 0 1px 0 rgb(255 255 255 / 0.10), 0 16px 48px rgb(0 0 0 / 0.60), 0 4px 12px rgb(0 0 0 / 0.32)",
            overflow: "hidden",
            animation: "gs-fade-in 150ms cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {normalised.map((opt) => {
            const active = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={active}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "9px 12px",
                  fontSize,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent)" : "var(--text-primary)",
                  background: active ? "rgb(255 49 98 / 0.10)" : "transparent",
                  cursor: "pointer",
                  transition: "background 120ms ease, color 120ms ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgb(255 255 255 / 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = active ? "rgb(255 49 98 / 0.10)" : "transparent";
                }}
              >
                <span>{opt.label}</span>
                {active && <Check size={12} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes gs-fade-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

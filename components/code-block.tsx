"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, Language, PrismTheme } from "prism-react-renderer";

/* ─────────────────────────────────────────────────────────────
   Syntax theme

   Every colour is a reference to a `--code-syntax-*` custom property
   defined in `app/globals.css`, so the same theme object renders the
   light and the dark palette and the two can never drift apart. The
   palette is the site's original one: warm orange numbers, green
   strings, amber keywords, gold functions. It is intentionally NOT
   monochrome — the greyscale rebrand covers the UI chrome and stops
   at the code block, where hue is doing real work.

   (Values are in globals.css — light on `:root`, dark on `.dark`.)
   ───────────────────────────────────────────────────────────── */

export const syntaxTheme: PrismTheme = {
  plain: { color: "var(--code-syntax-plain)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--code-syntax-comment)", fontStyle: "italic" },
    },
    {
      types: ["punctuation"],
      style: { color: "var(--code-syntax-punctuation)" },
    },
    {
      types: ["property", "tag", "boolean", "number", "constant", "symbol"],
      style: { color: "var(--code-syntax-number)" },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin"],
      style: { color: "var(--code-syntax-string)" },
    },
    {
      types: ["operator", "entity", "url"],
      style: { color: "var(--code-syntax-operator)" },
    },
    {
      types: ["atrule", "attr-value", "keyword"],
      style: { color: "var(--code-syntax-keyword)" },
    },
    {
      types: ["function", "class-name"],
      style: { color: "var(--code-syntax-function)" },
    },
    {
      types: ["regex", "important", "variable"],
      style: { color: "var(--code-syntax-regex)" },
    },
    { types: ["deleted"], style: { color: "var(--code-syntax-deleted)" } },
    { types: ["inserted"], style: { color: "var(--code-syntax-inserted)" } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

/** Window dots — macOS traffic lights, and deliberately NOT neutral.
    They are the one piece of coloured chrome on the site: the code block
    is styled as an Apple window, and the red/amber/green triplet is what
    makes it read as one instantly. Greying them out (as an earlier pass
    did) costs that recognition and buys nothing — they are three 12px
    circles, not a colour scheme. The inset ring is the subtle darkening
    real macOS controls have, and the fills carry ~82% alpha in the token
    so they read as glass rather than as three bright spots. */
function WindowDots() {
  return (
    <div className="flex gap-2" aria-hidden="true">
      <div className="h-3 w-3 rounded-full bg-[var(--traffic-red)] ring-1 ring-inset ring-black/5" />
      <div className="h-3 w-3 rounded-full bg-[var(--traffic-amber)] ring-1 ring-inset ring-black/5" />
      <div className="h-3 w-3 rounded-full bg-[var(--traffic-green)] ring-1 ring-inset ring-black/5" />
    </div>
  );
}

function CopyButton({
  onCopy,
  copied,
  className,
}: {
  onCopy: () => void;
  copied: boolean;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={`h-7 w-7 p-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 group-focus-within:opacity-100 transition-opacity ${className ?? ""}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--term-prompt)]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

function BashTerminal({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const cmds = code
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#"))
      .join("\n");
    await navigator.clipboard.writeText(cmds);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-[var(--term-border)] bg-[var(--term-bg)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_12px_32px_-16px_rgba(0,0,0,0.18)]">
      {/* Always-dark terminal chrome, independent of the page theme. */}
      <div className="flex items-center justify-between px-5 py-3 bg-[var(--term-header)] border-b border-[var(--term-border)]">
        <div className="flex items-center gap-2">
          <WindowDots />
          <span className="text-micro font-mono text-[var(--term-muted)] ml-3">
            {filename || "terminal"}
          </span>
        </div>
        <CopyButton
          onCopy={copyToClipboard}
          copied={copied}
          className="hover:bg-white/10"
        />
      </div>
      {/* Terminal content */}
      <div className="p-5 font-mono text-[13px] leading-[1.75]">
        {lines.map((line, i) => {
          const trimmed = line.trimStart();
          if (trimmed.startsWith("#"))
            return (
              <div key={i} className="text-[var(--term-comment)] italic">
                {line}
              </div>
            );
          if (!trimmed) return <div key={i} className="h-[1.75em]" />;
          if (
            trimmed.startsWith("$") ||
            trimmed.match(
              /^(bunx|npx|node|bun|npm|stabilize-cli|git|cd|mkdir|rm)/,
            )
          ) {
            return (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[var(--term-prompt)] select-none shrink-0">
                  ❯
                </span>
                <span className="text-[var(--term-fg)]">
                  {trimmed.replace(/^\$\s*/, "")}
                </span>
              </div>
            );
          }
          return (
            <div key={i} className="text-[var(--term-muted)] pl-4">
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Shell commands — and only shell commands — get the dark terminal.
  // These are the snippets the reader is meant to paste into a shell, so
  // the prompt-and-output treatment is the honest one.
  //
  // Everything else is *code* and belongs in the Apple window with syntax
  // highlighting. SQL used to be routed here and came out as flat dim
  // text: `BashTerminal` only special-cases lines matching a command
  // prefix, and `SELECT … FROM users` matches nothing, so every keyword
  // lost its colour. A `.env` file is configuration rather than a
  // session, so it is code too.
  if (language === "bash" || language === "sh" || language === "shell") {
    return <BashTerminal code={code} filename={filename || "terminal"} />;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langMap: Record<string, Language> = {
    ts: "typescript",
    js: "javascript",
  };
  const resolvedLang = (langMap[language] || language) as Language;
  const label = filename || language;

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-code-border shadow-[0_1px_3px_rgba(0,0,0,0.06),0_12px_32px_-16px_rgba(0,0,0,0.18)]">
      {/* Apple-style header - always shown */}
      <div className="flex items-center justify-between px-5 py-3 bg-code-header border-b border-code-border">
        <div className="flex items-center gap-2">
          <WindowDots />
          <span className="text-micro font-mono text-code-muted ml-3">
            {label}
          </span>
        </div>
        <CopyButton
          onCopy={copyToClipboard}
          copied={copied}
          className="hover:bg-accent-subtle text-code-muted hover:text-accent-subtle-foreground"
        />
      </div>
      {/* Code content */}
      <div className="bg-code-bg">
        <Highlight
          code={code.trim()}
          language={resolvedLang}
          theme={syntaxTheme}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="overflow-x-auto text-mono font-mono"
              style={{
                ...style,
                background: "transparent",
                fontFeatureSettings: "'liga' 1, 'calt' 1",
                margin: 0,
                padding: "16px 20px",
                boxShadow: "none",
              }}
            >
              <code>
                {tokens.map((line, i) => {
                  const { key: lk, ...lp } = getLineProps({ line, key: i });
                  return (
                    <div key={String(lk)} {...lp} className="min-h-[1.75em]">
                      {showLineNumbers && (
                        <span className="text-code-muted/70 inline-block w-10 text-right pr-4 select-none text-[11px]">
                          {i + 1}
                        </span>
                      )}
                      {line.map((token, key) => {
                        const { key: tk, ...tp } = getTokenProps({
                          token,
                          key,
                        });
                        return <span key={String(tk)} {...tp} />;
                      })}
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

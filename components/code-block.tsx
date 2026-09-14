"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, Language, PrismTheme } from "prism-react-renderer";
import { useTheme } from "next-themes";

// Light theme for code blocks
const lightTheme: PrismTheme = {
  plain: { color: "#3d3428", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#9e9590", fontStyle: "italic" },
    },
    { types: ["punctuation"], style: { color: "#8a7e72" } },
    {
      types: ["property", "tag", "boolean", "number", "constant", "symbol"],
      style: { color: "#c45d2e" },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin"],
      style: { color: "#4a7c30" },
    },
    { types: ["operator", "entity", "url"], style: { color: "#a07030" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#8a5e20" } },
    { types: ["function", "class-name"], style: { color: "#7a5e1a" } },
    { types: ["regex", "important", "variable"], style: { color: "#9a6040" } },
    { types: ["deleted"], style: { color: "#c44040" } },
    { types: ["inserted"], style: { color: "#4a7c30" } },
  ],
};

// Dark theme for code blocks (dark mode)
const darkTheme: PrismTheme = {
  plain: { color: "#e8dcc8", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#6b6560", fontStyle: "italic" },
    },
    { types: ["punctuation"], style: { color: "#8a7e72" } },
    {
      types: ["property", "tag", "boolean", "number", "constant", "symbol"],
      style: { color: "#e0916e" },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin"],
      style: { color: "#a8c686" },
    },
    { types: ["operator", "entity", "url"], style: { color: "#d4a76a" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#d4a76a" } },
    { types: ["function", "class-name"], style: { color: "#e8c88a" } },
    { types: ["regex", "important", "variable"], style: { color: "#c9967e" } },
    { types: ["deleted"], style: { color: "#e06c75" } },
    { types: ["inserted"], style: { color: "#a8c686" } },
  ],
};

// Dark terminal theme (always dark for bash/SQL)
const terminalTheme: PrismTheme = {
  plain: { color: "#e8dcc8", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "#6b6560", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#8a7e72" } },
    {
      types: ["property", "tag", "boolean", "number", "constant", "symbol"],
      style: { color: "#e0916e" },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin"],
      style: { color: "#a8c686" },
    },
    { types: ["operator", "entity", "url"], style: { color: "#d4a76a" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#d4a76a" } },
    { types: ["function", "class-name"], style: { color: "#e8c88a" } },
    { types: ["regex", "important", "variable"], style: { color: "#c9967e" } },
    { types: ["deleted"], style: { color: "#e06c75" } },
    { types: ["inserted"], style: { color: "#a8c686" } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
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
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border/60 bg-[#1e1e1e]">
      {/* Apple-style header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-white/30 ml-3">
            {filename || "terminal"}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
          tabIndex={-1}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#27c93f]" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-white/30" />
          )}
        </Button>
      </div>
      {/* Terminal content */}
      <div className="p-5 font-mono text-[13px] leading-[1.75]">
        {lines.map((line, i) => {
          const trimmed = line.trimStart();
          if (trimmed.startsWith("#"))
            return (
              <div key={i} className="text-[#6b6560] italic">
                {line}
              </div>
            );
          if (!trimmed) return <div key={i} className="h-[1.75rem]" />;
          if (
            trimmed.startsWith("$") ||
            trimmed.match(
              /^(bunx|npx|node|bun|npm|stabilize-cli|git|cd|mkdir|rm)/,
            )
          ) {
            return (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#27c93f] select-none shrink-0">❯</span>
                <span className="text-white/90">
                  {trimmed.replace(/^\$\s*/, "")}
                </span>
              </div>
            );
          }
          return (
            <div key={i} className="text-white/40 pl-4">
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
  const { resolvedTheme } = useTheme();

  // Bash/shell/SQL -> always dark terminal
  if (
    language === "bash" ||
    language === "sh" ||
    language === "shell" ||
    language === "sql" ||
    language === "dotenv"
  ) {
    return (
      <BashTerminal
        code={code}
        filename={filename || (language === "sql" ? "sql" : "terminal")}
      />
    );
  }

  // Code blocks -> adaptive light/dark bg
  const syntaxTheme = resolvedTheme === "dark" ? darkTheme : lightTheme;
  const isDark = resolvedTheme === "dark";

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
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border/60">
      {/* Apple-style header - always shown */}
      <div
        className={`flex items-center justify-between px-5 py-3 ${isDark ? "bg-[#2d2d2d] border-b border-white/5" : "bg-[#f5f0eb] border-b border-border/60"}`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span
            className={`text-xs font-mono ml-3 ${isDark ? "text-white/30" : "text-[#999]"}`}
          >
            {label}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className={`h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          tabIndex={-1}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#27c93f]" />
          ) : (
            <Copy
              className={`h-3.5 w-3.5 ${isDark ? "text-white/30" : "text-[#999]"}`}
            />
          )}
        </Button>
      </div>
      {/* Code content */}
      <div className={isDark ? "bg-[#1e1e1e]" : "bg-[#faf8f5]"}>
        <Highlight
          code={code.trim()}
          language={resolvedLang}
          theme={syntaxTheme}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="overflow-x-auto text-[13px] leading-[1.75]"
              style={{
                ...style,
                background: "transparent",
                fontFamily:
                  "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
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
                    <div key={String(lk)} {...lp} className="min-h-[1.75rem]">
                      {showLineNumbers && (
                        <span
                          className={`inline-block w-10 text-right pr-4 select-none text-[11px] ${isDark ? "text-white/15" : "text-[#ccc]"}`}
                        >
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

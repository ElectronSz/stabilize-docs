"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, Language, PrismTheme } from "prism-react-renderer";
import { useTheme } from "next-themes";

// Warm amber theme for dark mode
const warmDark: PrismTheme = {
  plain: {
    color: "#e8dcc8",
    backgroundColor: "transparent",
  },
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
    { types: ["string", "template-string"], style: { color: "#a8c686" } },
    { types: ["deleted"], style: { color: "#e06c75" } },
    { types: ["inserted"], style: { color: "#a8c686" } },
  ],
};

// Warm amber theme for light mode
const warmLight: PrismTheme = {
  plain: {
    color: "#3d3428",
    backgroundColor: "transparent",
  },
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
    { types: ["string", "template-string"], style: { color: "#4a7c30" } },
    { types: ["deleted"], style: { color: "#c44040" } },
    { types: ["inserted"], style: { color: "#4a7c30" } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const syntaxTheme = resolvedTheme === "dark" ? warmDark : warmLight;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map common aliases
  const langMap: Record<string, Language> = {
    ts: "typescript",
    js: "javascript",
    sh: "bash",
    py: "python",
    dotenv: "bash",
    sql: "sql",
  };
  const resolvedLang = (langMap[language] || language) as Language;

  return (
    <div className="relative group my-4">
      {filename && (
        <div className="flex items-center justify-between px-5 py-2.5 rounded-t-xl border border-border/60 border-b-0 bg-secondary/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
            </div>
            <span className="text-xs font-mono text-muted-foreground ml-2">
              {filename}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
            {language}
          </span>
        </div>
      )}
      <div
        className={`relative ${filename ? "rounded-b-xl rounded-t-none" : "rounded-xl"} border border-border/60 bg-secondary/20 overflow-hidden`}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="absolute top-3 right-3 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent/20"
          tabIndex={-1}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
        <Highlight
          code={code.trim()}
          language={resolvedLang}
          theme={syntaxTheme}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`overflow-x-auto text-[13px] leading-7 ${className}`}
              style={{
                ...style,
                background: "transparent",
                fontFamily:
                  "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
                fontFeatureSettings: "'liga' 1, 'calt' 1",
                fontVariationSettings: "normal",
                margin: 0,
                padding: filename ? "16px 20px" : "20px 24px",
                boxShadow: "none",
              }}
            >
              <code>
                {tokens.map((line, i) => {
                  const { key: lineKey, ...lineProps } = getLineProps({
                    line,
                    key: i,
                  });
                  return (
                    <div
                      key={String(lineKey)}
                      {...lineProps}
                      className="min-h-[1.75rem]"
                    >
                      {showLineNumbers && (
                        <span className="inline-block w-10 text-right pr-4 text-muted-foreground/30 select-none text-[11px]">
                          {i + 1}
                        </span>
                      )}
                      {line.map((token, key) => {
                        const { key: tokenKey, ...tokenProps } = getTokenProps({
                          token,
                          key,
                        });
                        return <span key={String(tokenKey)} {...tokenProps} />;
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

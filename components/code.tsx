"use client";

import { Highlight, Language, PrismTheme } from "prism-react-renderer";
import { useTheme } from "next-themes";

const lightTheme: PrismTheme = {
  plain: { color: "#3d3428", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "#9e9590", fontStyle: "italic" } },
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

const darkTheme: PrismTheme = {
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
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const syntaxTheme = resolvedTheme === "dark" ? darkTheme : lightTheme;
  const isDark = resolvedTheme === "dark";

  return (
    <div className="rounded-xl overflow-hidden border border-border/60 my-4">
      <div
        className={`flex items-center gap-2 px-5 py-3 ${isDark ? "bg-[#2d2d2d] border-b border-white/5" : "bg-[#f5f0eb] border-b border-border/60"}`}
      >
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <span
          className={`text-xs font-mono ml-3 ${isDark ? "text-white/30" : "text-[#999]"}`}
        >
          {language}
        </span>
      </div>
      <div className={isDark ? "bg-[#1e1e1e]" : "bg-[#faf8f5]"}>
        <Highlight
          code={code.trim()}
          language={language as Language}
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

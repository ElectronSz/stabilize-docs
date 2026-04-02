"use client";

import React from "react";
import { Highlight, Language, PrismTheme } from "prism-react-renderer";
import { useTheme } from "next-themes";

const warmDark: PrismTheme = {
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

const warmLight: PrismTheme = {
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

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const { theme } = useTheme();
  const syntaxTheme = theme === "dark" ? warmDark : warmLight;

  return (
    <Highlight
      code={code.trim()}
      language={language as Language}
      theme={syntaxTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="rounded-xl overflow-x-auto text-[13px] leading-7"
          style={{
            ...style,
            background: "transparent",
            fontFamily:
              "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
            fontFeatureSettings: "'liga' 1, 'calt' 1",
            margin: 0,
            padding: "20px 24px",
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
  );
}

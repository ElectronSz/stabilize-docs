"use client";

import { Highlight, Language } from "prism-react-renderer";
import { syntaxTheme } from "@/components/code-block";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/**
 * Compact inline-adjacent code sample. Shares the Prism theme with
 * `code-block.tsx` so the two never drift; light/dark come from the
 * `--code-*` tokens in `app/globals.css`.
 */
export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-code-border my-6">
      <div className="flex items-center gap-2 px-5 py-3 bg-code-header border-b border-code-border">
        <div className="flex gap-2" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-micro font-mono text-code-muted ml-3">
          {language}
        </span>
      </div>
      <div className="bg-code-bg">
        <Highlight
          code={code.trim()}
          language={language as Language}
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

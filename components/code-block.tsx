"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Highlight, Language, PrismTheme } from "prism-react-renderer"
import { useTheme } from "next-themes"

export const nightOwlDark: PrismTheme = {
  plain: {
    color: "#d6deeb",
    backgroundColor: "transparent"
  },
  styles: [
    { types: ["comment"], style: { color: "#637777", fontStyle: "italic" } },
    { types: ["string", "inserted"], style: { color: "#ecc48d" } },
    { types: ["number"], style: { color: "#f78c6c" } },
    { types: ["builtin", "char", "constant", "function"], style: { color: "#82aaff" } },
    { types: ["punctuation", "selector"], style: { color: "#c792ea" } },
    { types: ["variable"], style: { color: "#addb67" } },
    { types: ["keyword", "operator", "tag"], style: { color: "#7fdbca" } },
    { types: ["class-name"], style: { color: "#ffeb95" } },
    { types: ["parameter"], style: { color: "#f78c6c" } },
    { types: ["property"], style: { color: "#addb67" } },
    { types: ["namespace"], style: { color: "#b2ccd6" } },
    { types: ["deleted"], style: { color: "#ef5350" } },
  ]
}

export const nightOwlLight: PrismTheme = {
  plain: {
    color: "#1e1e1e",
    backgroundColor: "transparent"
  },
  styles: [
    { types: ["comment"], style: { color: "#999988", fontStyle: "italic" } },
    { types: ["string", "inserted"], style: { color: "#b56959" } },
    { types: ["number"], style: { color: "#296aa3" } },
    { types: ["builtin", "char", "constant", "function"], style: { color: "#267f99" } },
    { types: ["punctuation", "selector"], style: { color: "#a1a1a1" } },
    { types: ["variable"], style: { color: "#0086b3" } },
    { types: ["keyword", "operator", "tag"], style: { color: "#7f5fc7" } },
    { types: ["class-name"], style: { color: "#795e26" } },
    { types: ["parameter"], style: { color: "#296aa3" } },
    { types: ["property"], style: { color: "#0086b3" } },
    { types: ["namespace"], style: { color: "#a67f59" } },
    { types: ["deleted"], style: { color: "#a61717" } },
  ]
}

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const syntaxTheme = resolvedTheme === "dark" ? nightOwlDark : nightOwlLight

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg border border-accent/30 bg-secondary/50 overflow-hidden my-4">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-accent/20 bg-secondary/30">
          <span className="text-sm font-mono text-muted-foreground">{filename}</span>
          <span className="text-xs text-muted-foreground/60 uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          tabIndex={-1}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Highlight code={code.trim()} language={language as Language} theme={syntaxTheme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`overflow-x-auto text-sm font-mono ${className} bg-transparent m-0 p-4`}
              style={{
                ...style,
                background: "transparent",
                fontFamily:
                  "JetBrains Mono, Fira Mono, Menlo, Monaco, 'Liberation Mono', 'Courier New', monospace",
                fontWeight: 400,
                fontSize: "0.95rem",
                boxShadow: "none",
                borderRadius: 0,
              }}
            >
              {showLineNumbers ? (
                <div className="flex">
                  <div className="select-none pr-4 text-muted-foreground/40 text-right min-w-[2.5rem]">
                    {tokens.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex-1">
                    {tokens.map((line, i) => {
                      const { key: lineKey, ...lineProps } = getLineProps({ line, key: i })
                      return (
                        <div key={String(lineKey)} {...lineProps}>
                          {line.map((token, key) => {
                            const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key })
                            return <span key={String(tokenKey)} {...tokenProps} />
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                tokens.map((line, i) => {
                  const { key: lineKey, ...lineProps } = getLineProps({ line, key: i })
                  return (
                    <div key={String(lineKey)} {...lineProps}>
                      {line.map((token, key) => {
                        const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key })
                        return <span key={String(tokenKey)} {...tokenProps} />
                      })}
                    </div>
                  )
                })
              )}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
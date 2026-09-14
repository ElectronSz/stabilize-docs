"use client"

import React from "react"
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
};

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
};

interface CodeBlockProps {
    code: string
    language: Language
}

export function CodeBlock({ code, language }: CodeBlockProps) {
      const { theme } = useTheme()
  const syntaxTheme = theme === "dark" ? nightOwlDark : nightOwlLight

    return (
        <Highlight code={code.trim()} language={language} theme={syntaxTheme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                    className={`rounded-md p-4 text-sm overflow-x-auto ${className}`}
                    style={{
                        ...style,
                        fontFamily: "JetBrains Mono, Fira Mono, Menlo, Monaco, 'Liberation Mono', 'Courier New', monospace",
                        fontWeight: 400,
                        fontSize: "1rem"
                    }}
                >
                    {tokens.map((line, i) => {
                        const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
                        return (
                            <div key={String(lineKey)} {...lineProps}>
                                {line.map((token, key) => {
                                    const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key });
                                    return <span key={String(tokenKey)} {...tokenProps} />;
                                })}
                            </div>
                        );
                    })}
                </pre>
            )}
        </Highlight>
    )
}
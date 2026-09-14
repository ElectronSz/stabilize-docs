"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"
import logo from "@/public/logo_text-transparent.png" 

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src={logo}
            alt="Stabilize ORM Logo"
            className="h-auto w-32"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/guides"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/api"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            API Reference
          </Link>
          <Link
            href="/examples"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Examples
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="hover:bg-accent/20">
            <a href="https://github.com/ElectronSz/stabilize-orm" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/docs/api">API Docs</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent/20"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-accent/20 bg-background/95 backdrop-blur-lg">
          <nav className="container flex flex-col gap-4 py-4">
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/guides"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides
            </Link>
            <Link
              href="/api"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              API Reference
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Examples
            </Link>
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-accent/30 hover:bg-accent/20 bg-transparent"
              >
                <a href="https://github.com/ElectronSz/stabilize-orm" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button asChild className="flex-1 bg-accent hover:bg-accent/90">
                <Link href="/docs/getting-started" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
import Link from "next/link"
import { Github, Twitter, BookOpen, Sparkle, MapPin, Heart } from "lucide-react"

// Replace with your logo import
import Image from "next/image"
import logo from "@/public/logo_both-transparent.png"

export function Footer() {
  return (
    <footer className="w-full border-t border-accent/20 bg-background/80 backdrop-blur-lg pt-8 pb-4 mt-16">
      <div className="container mx-auto flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Logo, Brand and tagline */}
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <Image
            src={logo}
            alt="Stabilize ORM Logo"
            className="h-auto w-64 "
            priority
          />
        </div>

        {/* Center: Navigation */}
        <nav className="flex flex-wrap gap-4 items-center text-sm font-medium">
          <Link href="/docs" className="hover:text-accent transition-colors flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Docs</span>
          </Link>
          <Link href="/features" className="hover:text-accent transition-colors">
            Features
          </Link>
          <Link href="/cli" className="hover:text-accent transition-colors">
            CLI
          </Link>
          <Link href="/data-types" className="hover:text-accent transition-colors">
            Data Types
          </Link>
          <a
            href="https://github.com/ElectronSz/stabilize"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://twitter.com/th3b0tk1ll3r"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </a>
        </nav>

        {/* Right: Copyright */}
        <div className="text-xs text-muted-foreground text-center md:text-right mt-2 md:mt-0">
          © {new Date().getFullYear()} Stabilize ORM. Built by{" "}
          <a href="https://github.com/ElectronSz" className="underline hover:text-accent">
            ElectronSz
          </a>
          .
        </div>
      </div>
      {/* Bottom: Heart and Eswatini */}
      <div className="flex flex-col items-center mt-6 gap-0">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500 animate-pulse" fill="currentColor" />
          <span>in Eswatini</span>
        </div>
      </div>
    </footer>
  )
}
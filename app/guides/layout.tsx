import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidesSidebar } from "@/components/guides-sidebar"

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <GuidesSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApiSidebar } from "@/components/api-sidebar"

export default function ApiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <ApiSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

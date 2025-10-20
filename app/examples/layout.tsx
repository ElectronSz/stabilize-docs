import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExamplesSidebar } from "@/components/examples-sidebar"

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <ExamplesSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

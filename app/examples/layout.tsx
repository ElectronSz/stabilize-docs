import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExamplesSidebar } from "@/components/examples-sidebar"
import { NavBreadcrumb } from "@/components/nav-breadcrumb"
import { PagePager } from "@/components/page-pager"
import { SectionIndex } from "@/components/section-index"
import { getSectionNavigation } from "@/lib/nav"

/**
 * Navigation is resolved here, on the server, from the filesystem — see
 * `lib/nav.ts`. The client components below only render what they are handed.
 */
export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nav = getSectionNavigation("examples")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <ExamplesSidebar groups={nav.groups} />
        {/* `min-w-0`: a flex item defaults to `min-width:auto`, so without this
            the main column refuses to shrink below its content's min-content
            width — usually a wide code block — and pushes the whole document
            wider than the viewport instead of letting the block scroll. */}
        <main className="flex-1 min-w-0">
          <NavBreadcrumb nav={nav} />
          {children}
          <SectionIndex nav={nav} />
          <PagePager nav={nav} />
        </main>
      </div>
      <Footer />
    </div>
  )
}

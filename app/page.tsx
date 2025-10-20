import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CodeExample } from "@/components/code-example"
import { DatabaseSupport } from "@/components/database-support"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CodeExample />
        <DatabaseSupport />
      </main>
      <Footer />
    </div>
  )
}

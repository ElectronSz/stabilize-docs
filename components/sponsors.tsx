import { DotCompanyMark } from "@/components/brand-icons";

const sponsors = [
  {
    name: "The Dot Company",
    href: "https://thedotcompany.dev",
    tagline: "Infrastructure meets Engineering",
    icon: DotCompanyMark,
  },
];

export function Sponsors() {
  return (
    <section className="relative section">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-small font-semibold text-accent uppercase tracking-widest mb-3">
            Sponsors
          </p>
          <h2 className="text-h2 mb-4">Supported by</h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Stabilize is developed with support from the companies below.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/40 px-7 py-5 hover:border-accent/40 hover:bg-accent-subtle/40 transition-colors duration-300"
            >
              {/* Neutral ink, same as the database marks — the sponsor's
                  own colours are not hardcoded. */}
              <sponsor.icon className="h-9 w-9 shrink-0 text-accent" />
              <span className="flex flex-col">
                <span className="text-body font-semibold tracking-tight text-foreground">
                  {sponsor.name}
                </span>
                <span className="text-small text-muted-foreground">
                  {sponsor.tagline}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
